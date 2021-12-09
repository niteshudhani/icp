import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Int "mo:base/Int";

actor Memo {

     public type Memo = {   
        id : Int; 
        userId: Principal;
        title: Text;
        note: Text;
        status: Int;
        createdAt : Int;
        updatedAt: Int;
    };

    public type InputMemo = {
        id : Int;
        title: Text;
        note: Text;
        status : Int;
    };

type MemoError = { #message : Text;};
private stable var counter: Int = 0;
private stable var entries : [(Int, Memo)] = [];

private var userMemos = HashMap.fromIter<Int,Memo>(entries.vals(), 10, Int.equal, Int.hash);

system func preupgrade() {
    entries := Iter.toArray(userMemos.entries());
};

system func postupgrade() {
    entries := [];
};

public shared(msg) func create(inputMemo : InputMemo) : async Result.Result<Memo, MemoError>{
        counter := counter + 1;
       let createMemo = {
            id = counter;
            userId = msg.caller;
            title = inputMemo.title;
            note = inputMemo.note;
            status =  inputMemo.status; 
            createdAt = Time.now();
            updatedAt = Time.now();
       };
      userMemos.put(counter,createMemo);
     #ok(createMemo);
    }; 

    public query(msg) func getPublishedData(): async [(Int, Memo)] {
        var publishedData = HashMap.HashMap<Int,Memo>(1, Int.equal, Int.hash);
        for ( (key, userMemo) in  userMemos.entries()) {
                if(userMemo.status == 1){
                   publishedData.put(userMemo.id ,userMemo );
                }
        };
        Array.sort(Iter.toArray(publishedData.entries()):[(Int, Memo)] , 
            func(a: (Int, Memo), b: (Int, Memo)) : {#less; #equal; #greater} 
            { 
                switch(Int.compare(a.0, b.0)) {
                    case(#less) {
                        #greater
                    };
                    case(#greater) {
                        #less
                    };
                    case(#equal) {
                        #equal
                    };
                }
            } 
        ) : [(Int, Memo)] ;
    };

     

    public shared(msg) func update(inputMemoUpdate : InputMemo) : async Result.Result<Memo, MemoError>{
        var existing = userMemos.get(inputMemoUpdate.id);
        switch (existing) {
            case (?existing) { 
                    let newMemo : Memo = {
                        id = existing.id;
                        userId = msg.caller;
                        title = inputMemoUpdate.title;
                        note = inputMemoUpdate.note;
                        status =  inputMemoUpdate.status;  
                        createdAt = existing.createdAt;
                        updatedAt = Time.now();
                    };
                    userMemos.put(inputMemoUpdate.id,newMemo);
                    #ok(newMemo);
             };
            case (null) {
                #err(#message("No Memo Found"));
            };
        }; 
    }; 
}
