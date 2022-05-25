import { connect } from "react-redux";

import React, { useState, useEffect } from "react";
import NotificationAlert from "react-notification-alert";
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
  Table,
  Modal,
} from "reactstrap";

const Dashboard = (props) => {
  const [newData, setNewData] = useState("");
  const [data, setData] = useState([]);
  const [plans, setPlans] = useState([]);
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
  const lockWallet = async (key) => {
    console.log(key);
    try {
      const payLoad = {
        public: data[key].public,
      };
      const response = await ApiCall(
        apiConfig.lockWallet.url,
        apiConfig.lockWallet.method,
        props.credential.loginToken,
        payLoad
      );
      if (response.status === 200) {
        notify(response.data.message, "success");
        setData(response.data.data);
      } else {
        notify(response.data.error, "danger");
      }
    } catch (error) {
      notify("Failed in lock/unlock wallet.", "danger");
    }
  };
  const { apiConfig, ApiCall } = global;
  const submit = async (e) => {
    e.preventDefault();
    if (newData == "") {
      notify("Please input a new private key.", "danger");
      return;
    }
    try {
      const payLoad = {
        newData,
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
        setNewData("");
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
            ele = response.data.data;
            return ele;
          });
          setNewData("");
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed in getting wallets.", "danger");
      }

      try {
        const response = await ApiCall(
          apiConfig.nft_readAllPlans.url,
          apiConfig.nft_readAllPlans.method,
          props.credential.loginToken
        );
        if (response.status === 200) {
          setPlans(response.data);
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed in getting all plans.", "danger");
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
                {/* <h5 className="title">Manage Wallet</h5> */}
              </CardHeader>
              <CardBody>
                <h3 className="title">Wallets</h3>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left">Public Key</th>
                      <th className="text-left">Blocked</th>
                      <th className="text-left">Created</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.public}</td>
                          <td className="text-left">
                            {item.isBlocked ? (
                              <span style={{ color: "red" }}>Blocked</span>
                            ) : (
                              "None"
                            )}
                          </td>
                          <td className="text-left">{item.created}</td>
                          <td className="text-left">
                            <Button
                              className="btn-link"
                              color="danger"
                              size="sm"
                              onClick={async () => lockWallet(key)}
                              title="lock/unlock"
                            >
                              <i className="tim-icons icon-lock-circle" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <hr />
                <h3 className="title">Plans</h3>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left">Public Key</th>
                      <th className="text-left">Contract</th>
                      <th className="text-left">Trigger</th>
                      <th className="text-left">Flipstate</th>
                      <th className="text-left">Sale Status</th>
                      <th className="text-left">ID range</th>
                      <th className="text-left">Mint Function</th>
                      <th className="text-left">Amount</th>
                      <th className="text-left">Price</th>
                      <th className="text-left">Delay</th>
                      <th className="text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.public}</td>
                          <td className="text-left">{item.token}</td>
                          <td className="text-left">{item.sniperTrigger}</td>
                          <td className="text-left">
                            {item.startFunction} {item.funcRegex}
                          </td>
                          <td className="text-left">{item.saleStatus}</td>
                          <td className="text-left">
                            {item.rangeStart}~{item.rangeEnd}
                          </td>
                          <td className="text-left">{item.mintFunction}</td>
                          <td className="text-left">{item.tokenAmount}</td>
                          <td className="text-left">{item.eth}</td>
                          <td className="text-left">
                            {item.waitTime} {item.delayMethod}(s)
                          </td>
                          <td className="text-left">{item.created}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                {/* <Row>
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
                </Row> */}
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

export default connect(mapStateToProps)(Dashboard);
