import http from "../http-common";
import { Memo } from "../../../../src/declarations/Memo";

class MemoDataService {
  // getAllUserMemos() {
  //   return  Memo.getUserMemos();
  // }

  getPublishedMemos() {
    return  Memo.getPublishedData();
  }

  // get(id) {
  //   return Memo.getMemoById(parseInt(id));
  // }

  create(data) {
      console.log(data);
     return  Memo.create(data);
  }

  update(data) {
    return Memo.update(data);
  }

}

export default new MemoDataService();