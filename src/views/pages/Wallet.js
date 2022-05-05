import { connect } from "react-redux";

import React, { useState, useEffect } from "react";
import NotificationAlert from "react-notification-alert";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

const Wallet = (props) => {
  const [newData, setNewData] = useState("");
  const [data, setData] = useState([]);
  const notificationAlertRef = React.useRef(null);
  const notify = (message, type) => {
    let options = {};
    options = {
      place: "tr",
      message: message,
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  const removeWallet=async (e,key)=>{
    try {

      const payLoad = {
        public:data[key].public
      };
      const response = await ApiCall(
        apiConfig.removeWallet.url,
        apiConfig.removeWallet.method,
        props.credential.loginToken,
        payLoad
      );
      if (response.status === 200) {
        notify(response.data.message, "success");
        setData((ele) => {
          let ele1=JSON.parse(JSON.stringify(ele));
          ele1.splice(key,1);
          console.log(ele1);
          return ele1;
        });
      } else {
        notify(response.data.error, "danger");
      }
    } catch (error) {
      notify("Failed in removing wallet.", "danger");
    }
  }
  const { apiConfig, ApiCall } = global;
  const submit = async (e) => {
    e.preventDefault();
    if (newData == "") {
      notify("Please input a new private key.", "danger");
      return;
    }
    try {
      const payLoad = {
        newData
      };
      const response = await ApiCall(
        apiConfig.addWallet.url,
        apiConfig.addWallet.method,
        props.credential.loginToken,
        payLoad
      );
      if (response.status === 200) {
        notify("New Wallet added.", "success");
        setData((ele) => {
          ele.push(response.data);
          return ele;
        });
        setNewData('');
      } else {
        notify(response.data.error, "danger");
      }
    } catch (error) {
      notify("Failed in adding wallet.", "danger");
    }

  };
  useEffect(() => {
    (async () => {
      try {
        const response = await ApiCall(
          apiConfig.getWallet.url,
          apiConfig.getWallet.method,
          props.credential.loginToken
        );
        if (response.status === 200) {
          setData((ele) => {
            ele = response.data;
            return ele;
          });
          setNewData('');
        } else {
          notify(response.data.error, "danger");
        }
      } catch (error) {
        notify("Failed in getting wallet.", "danger");
      }
    })();
  }, []);
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <h5 className="title">Manage Wallet</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="pr-md-1" md="12">
                    <FormGroup>
                      <label>Private Key</label>
                      <Input
                        type="text"
                        value={newData}
                        onChange={(e) => setNewData(e.target.value)}
                      />
                      <Button
                        className="btn-fill"
                        color="primary"
                        type="button"
                        onClick={submit}
                      >
                        Add
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
                {
                  data.map((ele, key) => (
                    <Row key={key}>
                      <Col className="pr-md-1" md="12">
                        {key + 1}. &nbsp;
                        Private Key : {ele.private}
                        <br />
                        Public Key : {ele.public}
                        <br />
                        {ele.bnb} BNB, {ele.eth} ETH
                        <Button onClick={(event)=>removeWallet(event, key)} className="btn-simple btn-round" color="primary" style={{float:'right'}}>
                        <i className="tim-icons icon-simple-remove" />
                        </Button>
                      </Col>
                    </Row>
                  ))
                }
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};

export default connect(mapStateToProps)(Wallet);
