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
  CustomInput,
} from "reactstrap";

const explorerURL = "https://etherscan.io/";
// const explorerURL = "https://testnet.bscscan.com/";

const Wallets = (props) => {
  const [data, setData] = useState([]);
  const [blockAT, setBlockAT] = useState(false);
  const [blockLogin, setBlockLogin] = useState(false);
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
  const lockWallet = async (data) => {
    try {
      // const payLoad = {
      //   public: item.public,
      // };
      const response = await ApiCall(
        apiConfig.lockWallet.url,
        apiConfig.lockWallet.method,
        props.credential.loginToken,
        data
      );
      if (response.status === 200) {
        notify(response.data.message, "success");
        setData(response.data.data);
      } else {
        notify(response.data.error, "danger");
      }
    } catch (error) {
      notify("Failed", "danger");
    }
  };
  const adminWallet = async (item) => {
    try {
      const payLoad = {
        public: item.public,
      };
      const response = await ApiCall(
        apiConfig.adminWallet.url,
        apiConfig.adminWallet.method,
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
      notify("Failed", "danger");
    }
  };
  const { apiConfig, ApiCall, shortenWallet } = global;

  const [errorModalStatus, setErrorModalStatus] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const showErrorModal = (data) => {
    setErrorModalStatus(true);
    setErrorData(JSON.parse(JSON.stringify(data)));
  };
  const closeErrorModal = () => {
    setErrorModalStatus(false);
  };
  const updateBlockAT = async (value) => {
    var data = {
      key: "blockAT",
      value: value,
    };
    try {
      const response = await ApiCall(
        apiConfig.update_setting.url,
        apiConfig.update_setting.method,
        props.credential.loginToken,
        data
      );
      notify("done", "success");
      setBlockAT(value);
    } catch (error) {
      if (error.response) notify(error.response.data.message, "danger");
      else if (error.request) notify("Request failed", "danger");
      else notify("Something went wrong", "danger");
    }
  };
  const updateBlockLogin = async (value) => {
    var data = {
      key: "blockLogin",
      value: value,
    };
    try {
      const response = await ApiCall(
        apiConfig.update_setting.url,
        apiConfig.update_setting.method,
        props.credential.loginToken,
        data
      );
      notify("done", "success");
      setBlockLogin(value);
    } catch (error) {
      if (error.response) notify(error.response.data.message, "danger");
      else if (error.request) notify("Request failed", "danger");
      else notify("Something went wrong", "danger");
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
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed in getting wallets.", "danger");
      }
    })();
    (async () => {
      try {
        const response = await ApiCall(
          apiConfig.read_setting.url,
          apiConfig.read_setting.method,
          props.credential.loginToken
        );
        if (response.status === 200) {
          response.data.data.map((item, key) => {
            if (item.key == "blockLogin") {
              setBlockLogin(item.value);
            }
            if (item.key == "blockAT") {
              setBlockAT(item.value);
            }
          });
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed", "danger");
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
                <h3 className="title">Admin Wallets</h3>
                <p>
                  (Admins always have access to all and also see all. No need to
                  purchase authorization NFT tokens.)
                </p>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left">Address</th>
                      <th className="text-left">Created</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .filter((item) => item.isAdmin)
                      .map((item, key) => {
                        return (
                          <tr key={key}>
                            <td className="text-left">
                              <a
                                href={`${explorerURL}/address/${item.public}`}
                                target="_blank"
                              >
                                {item.public}
                              </a>
                            </td>
                            <td className="text-left">{item.created}</td>
                            <td className="text-left">
                              <Button
                                className="btn-link"
                                color="success"
                                size="sm"
                                onClick={async () => adminWallet(item)}
                                title="Remove from admin list"
                              >
                                <i className="tim-icons icon-simple-delete" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <h3 className="title">Users Wallets</h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="col-md-3">
                    <h4 className="title">Block all user wallets for login</h4>
                    <div className="d-flex align-items-center">
                      <span className="mr-2">off</span>
                      <CustomInput
                        type="switch"
                        id="switch-5"
                        className="mt-n4"
                        checked={blockLogin}
                        onChange={(e) => updateBlockLogin(e.target.checked)}
                      />
                      <span className="ml-n2">on</span>
                    </div>
                  </Col>
                  <Col className="col-md-3">
                    <h4 className="title">
                      Block all user wallets for analytic tool
                    </h4>

                    <div className="d-flex align-items-center">
                      <span className="mr-2">off</span>
                      <CustomInput
                        type="switch"
                        id="switch-6"
                        className="mt-n4"
                        checked={blockAT}
                        onChange={(e) => updateBlockAT(e.target.checked)}
                      />
                      <span className="ml-n2">on</span>
                    </div>
                  </Col>
                </Row>
                <br />
                <br />
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left">Address</th>
                      <th className="text-left">Blocked</th>
                      <th className="text-left">Created</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .filter((item) => !item.isAdmin)
                      .map((item, key) => {
                        return (
                          <tr key={key}>
                            <td className="text-left">
                              <a
                                href={`${explorerURL}/address/${item.public}`}
                                target="_blank"
                              >
                                {item.public}
                              </a>
                            </td>
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
                                color="success"
                                size="sm"
                                onClick={async () => adminWallet(item)}
                                title="Add to admin list"
                              >
                                <i className="tim-icons icon-simple-add" />
                              </Button>
                              <Button
                                className="btn-link"
                                color="danger"
                                size="sm"
                                onClick={async () => lockWallet(item)}
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
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
          </Col>
        </Row>
        {/* error modal */}
        <Modal modalClassName="modal-black" isOpen={errorModalStatus}>
          <div className="modal-header">
            <h4>Error Information</h4>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={closeErrorModal}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
          {errorData && (
            <div className="modal-body padBtt word-breakall">
              {errorData.error}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};

export default connect(mapStateToProps)(Wallets);
