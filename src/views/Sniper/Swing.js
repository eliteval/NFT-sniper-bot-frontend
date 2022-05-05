import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader, 
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
  Table,
  UncontrolledTooltip,
  Modal,
} from "reactstrap";
// react component used to create sweet alerts
import classNames from "classnames";
import io from "socket.io-client";
import { connect } from "react-redux";
import Datetime from "react-datetime";
import Select from "react-select";
import ReactTable from "components/ReactTable/ReactTable.js";
import "./sniper.css";
import NotificationAlert from "react-notification-alert";
import snip_image from "assets/img/sniper1.jpg";
const Swing = (props) => {
  //necessary functions import
  const {apiConfig, ApiCall} = global;
  const [socket, setSocket] = useState("");
  const notificationAlertRef = React.useRef(null);
  const showNotify = async (title, text, type = "success", place = 'tr', autoDismiss = 5) => {
    const options = {
      place: place,
      message: (
        <div><div>{title}</div><div>{text}</div></div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: autoDismiss,
    };
    notificationAlertRef.current.notificationAlert(options);
  }
  //setting modal
  const [modalAdd, setModalAdd] = useState(false);
  const [addData, setAddData] = useState({
    addr: "",
    min:3,
    max:5,
    interval:1800,
    slippage:10,
  });
  const toggleModalAdd = () => {
    setAddData(
      {
        addr: "",
        min:3,
        max:5,
        interval:1800,
        slippage:10,
      }
    );
    setModalAdd(!modalAdd);
  };
  const closeModal = () => {
    setModalAdd(false);
  }
  const addHandler = async () => {
    try {
      const response = await ApiCall(
        apiConfig.swing_add.url,
        apiConfig.swing_add.method,
        props.credential.loginToken,
        addData
      );
      closeModal();
      showNotify(response.data.message,'','success');
      setLogData(response.data.data);
    } catch (error) {
      if (error.response) {
        showNotify(error.response.data.message,'','danger');
      } 
      else if (error.request) {
        // client never received a response, or request never left
        showNotify("Request failed",'','danger');
        // console.log(error.request)
      }
      else {
        showNotify("Something went wrong",'','danger');
      }
    }
  };
  const del = async (_id) => {
    try {
      const response = await ApiCall(
        apiConfig.swing_del.url,
        apiConfig.swing_del.method,
        props.credential.loginToken,
        {_id:_id}
      );
      if (response.data.data) setLogData(response.data.data);
    } catch (error) {
      if (error.response) {
        showNotify(error.response.data.message,'','danger');
      } 
      else if (error.request) {
        // client never received a response, or request never left
        showNotify("Request failed",'','danger');
        // console.log(error.request)
      }
      else {
        showNotify("Something went wrong",'','danger');
      }
    }
  };
  //log table
  const [logData, setLogData] = useState([]);
  //init
  useEffect(() => {
    //set socket
    if (props.credential.loginToken) {
      setSocket(
        io(apiConfig.endPoint, {
          auth: {
            token: props.credential.loginToken,
          },
        })
      );
    } else {
      setSocket(io(apiConfig.endPoint));
    }
    //read settings
    async function readLog(){
      try {
        const response = await ApiCall(
          apiConfig.swing_read.url,
          apiConfig.swing_read.method,
          props.credential.loginToken,
          {}
        );
        if (response.data.data) setLogData(response.data.data);
      } catch (error) {
        // showNotify("Failed!",'','danger');
      }
    }
    readLog();
  }, [props.credential.loginToken]);
  //function with socket
  useEffect(() => {
    if (socket) {
      const publicKey = props.credential.loginUserName;
      socket.on("connect", () => {
        // when connection started
        console.log("connect");
        socket.on("swing:one:logStatus", (data) => {
          setLogData(data.filter(x=>x.public === publicKey));
        });
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="content">
        {/* logs table */}
        <Card>
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <Button className="btn1" onClick={() => setModalAdd(true)}>Add swing</Button>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-center">#</th>
                      <th>Address</th>
                      <th className="text-left">Minimum Swing</th>
                      <th className="text-left">Maximum Swing</th>
                      <th className="text-left">Interval</th>
                      <th className="text-left">Transaction Count</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      logData.map((item,key)=>(
                        <tr key={key}>
                          <td key={1} className="text-center">
                            <div className="photo">
                              <img
                                alt="..."
                                src={require("assets/img/bitcoin.png").default}
                              />
                            </div>
                          </td>
                          <td key={2}><a href={`${item.ex_url}/${item.presaleAddr}`} target="_blank">{item.addr}</a></td>
                          <td key={3} className="text-left">{item.min}</td>
                          <td key={4} className="text-left">{item.max}</td>
                          <td key={5} className="text-left">{item.interval}</td>
                          <td key={6} className="text-left">{item.count}</td>
                          <td key={8} className="text-left">
                            <Button className="btn-link" color="danger" size="sm"  onClick={() => del(item._id)} title="Delete">
                              <i className="tim-icons icon-simple-remove" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Card>
      </div>
      {/* setting modal */}
      <Modal modalClassName="modal-black mModalSm" isOpen={modalAdd}>
        <div className="modal-header">
          <h4>Setting</h4>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModalAdd}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
        <div className="modal-body">
          <Form className="form1">
            <Row>
              <Col className="pr-md-1" md="12">
                <FormGroup>
                  <label>Token address</label>
                  <Input
                    type="text"
                    value={addData.addr}
                    onChange={(e) =>
                      setAddData({ ...addData, addr: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col className="pr-md-1" md="12">
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <label>Minimum(bnb)</label>
                      <Input
                        type="number"
                        value={addData.min}
                        onChange={(e) =>
                          setAddData({ ...addData, min: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                        <label>Maximum(bnb)</label>
                        <Input
                          type="number"
                          value={addData.max}
                          onChange={(e) =>
                            setAddData({ ...addData, max: e.target.value })
                          }
                        />
                    </FormGroup>
                  </Col>
                </Row>

              </Col>
              {/* <Col className="pr-md-1" md="12">
                <FormGroup>
                  <label>Slippage(%)</label>
                  <Input
                    type="number"
                    value={addData.slippage}
                    onChange={(e) =>
                      setAddData({ ...addData, slippage: e.target.value })
                    }
                  />
                </FormGroup>
              </Col> */}
              <Col className="pr-md-1" md="12">
                <FormGroup>
                  <label>Interval time(seconds)</label>
                  <Input
                    type="number"
                    value={addData.interval}
                    onChange={(e) =>
                      setAddData({ ...addData, interval: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col className="pr-md-1" md="12">
                <Button color="primary" size="lg" onClick={addHandler}>
                  O K
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};
export default connect(mapStateToProps)(Swing);
