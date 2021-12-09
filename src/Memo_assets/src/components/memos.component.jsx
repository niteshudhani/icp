import React, { Component } from "react";
import MemoDataService from "../services/memo.service";
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'



export default class Memos extends Component {
  constructor(props) {
    super(props);
    this.retrieveMemos = this.retrieveMemos.bind(this);
    this.addNewMemo = this.addNewMemo.bind(this);
    this.editMemo = this.editMemo.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDesc = this.onChangeDesc.bind(this);

    this.state = {
      Memos: [],
      chunkSize: 3
    };
  }

  componentDidMount() {
    this.retrieveMemos();
  }

  retrieveMemos() {
    MemoDataService.getPublishedMemos()
      .then(response => {
        this.setState({
          Memos: response
        });
        console.log(response);
      })
      .catch(e => {
        console.log(e);
      });
  }

  addNewMemo() {
    var memo = {
      id: 1,
      title: 'New Memo Title - Please Change',
      note: 'New Memo - Please Change',
      status: 1,
    };

    MemoDataService.create(memo)
      .then(response => {
        this.retrieveMemos();
      })
      .catch(e => {
        console.log(e);
      });
  }

  editMemo(id) {
    let memos = this.state.Memos;
    for (let memo of memos) {
      if (parseInt(memo[0]) == id) {
        memo[1].editable = true;
      } else {
        memo[1].editable = false;
      }
    }
    this.setState({Memos: memos});
    console.log(this.state);
  }

  onChangeTitle(e, id) {
    let memos = this.state.Memos;
    for (let memo of memos) {
      if (parseInt(memo[0]) == id) {
        memo[1].title = e.target.value;
        memo[1].touched = true;
        break;
      }
    }
    this.setState({Memos: memos});
  }

  onChangeDesc(e, id) {
    let memos = this.state.Memos;
    for (let memo of memos) {
      if (parseInt(memo[0]) == id) {
        memo[1].note = e.target.value;
        memo[1].touched = true;
        break;
      }
    }
    this.setState({Memos: memos});
  }

  saveMemo(id) {
    let memos = this.state.Memos;
    let editedMemo;
    for (let memo of memos) {
      if (parseInt(memo[0]) == id) {
        editedMemo = memo;
      }
    }

    var data = {
      id: editedMemo[1].id,
      title: editedMemo[1].title,
      note: editedMemo[1].note,
      status:  1 
    };

    MemoDataService.update(data)
      .then(response => {
        this.retrieveMemos();
      });
  }

  renderGroups() {
    let a = this.state.Memos.reduce((acc, item, idx) => {
      let group = acc.pop();
      if (group.length == this.state.chunkSize) {
        acc.push(group);
        group = [];
      }
      group.push(item);
      acc.push(group);
      return acc;
    }, [[]]);

    return a.map((item) => {
      return (
        <React.Fragment>
          <div key={item} className='row mt-3'>
            {item && item.map((Memo, index) => (
              <div className="col-4">
                <Card key={Memo[1].id} style={{ width: '18rem', backgroundColor: "#FFFF88", color: "38a1c5" }}>
                  {!Memo[1].editable &&
                    <React.Fragment>
                      <Card.Header>
                        <button
                          to={"/memo/" + Memo[1].id}
                          className="btn btn-primary"
                          onClick={e => this.editMemo(Memo[1].id)}
                        >
                          Edit
                        </button>
                      </Card.Header>
                      <Card.Body>
                        <Card.Title><Badge bg="success">{parseInt(Number(Memo[1].id))}</Badge> {Memo[1].title}</Card.Title>
                        <Card.Text>
                          {Memo[1].note}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        <small>
                          Updated At: {(new Date(parseInt(Number(Memo[1].updatedAt).toString().slice(0, -6), 10))).toLocaleDateString("en-US")} {" "}
                          {(new Date(parseInt(Number(Memo[1].updatedAt).toString().slice(0, -6), 10))).toLocaleTimeString('en-US')}
                        </small>
                      </Card.Footer>

                    </React.Fragment>
                  }

                  {Memo[1].editable &&
                    <React.Fragment>
                      <Card.Header>
                        <button
                          to={"/memo/" + Memo[1].id}
                          className="btn btn-primary"
                          onClick={e => this.saveMemo(Memo[1].id)}
                          disabled={!Memo[1].touched}
                        >
                          Save
                        </button>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <Form>
                            <Form.Group className="mb-3" controlId="memoTitle">
                              <Form.Label>Memo Title</Form.Label>
                              <Form.Control type="text" placeholder="Memo Title" value={Memo[1].title}
                                onChange={e => this.onChangeTitle(e, Memo[1].id)}
                              />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="memoDesc">
                              <Form.Label>Memo Description</Form.Label>
                              <Form.Control type="text" placeholder="Memo Description" value={Memo[1].note}
                                onChange={e => this.onChangeDesc(e, Memo[1].id)}
                              />
                            </Form.Group>
                          </Form>
                        </Card.Text>
                      </Card.Body>
                    </React.Fragment>
                  }

                </Card>
              </div>
            ))}
          </div>
          <br />
        </React.Fragment>
      );
    });
  }


  render() {
    const { Memos } = this.state;
    return (
      <React.Fragment>
        <div className="row mt-3 justify-content-end">
          <div className="col-md-3">
            <button className="btn btn-primary" onClick={e => this.addNewMemo(e.target.value)}>Add a new Memo</button>
          </div>
        </div>
        {this.renderGroups()}
      </React.Fragment>
    );
  }
}
