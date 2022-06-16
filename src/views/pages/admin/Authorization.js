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
  CustomInput,
  Modal,
} from "reactstrap";

const explorerURL = "https://etherscan.io/";
// const explorerURL = "https://testnet.bscscan.com/";

const Authorization = (props) => {
  const [data, setData] = useState([]);
  const [checkAuth, setCheckAuth] = useState(false);
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

  const [modalAdd, setModalAdd] = useState(false);
  const [addData, setAddData] = useState({});
  const showAddModal = (data = false) => {
    if (data) setAddData(data);
    else
      setAddData({
        address: "",
        amount: 1,
      });
    setModalAdd(true);
  };
  const closeAddModal = () => {
    setModalAdd(false);
  };
  const addHandler = async () => {
    try {
      const response = await ApiCall(
        apiConfig.addAuthoriztion.url,
        apiConfig.addAuthoriztion.method,
        props.credential.loginToken,
        addData
      );
      if (response.data.data) {
        setData(response.data.data);
        closeAddModal(false);
      }
    } catch (error) {
      if (error.response) notify(error.response.data.message, "danger");
      else if (error.request) notify("Request failed", "danger");
      else notify("Something went wrong", "danger");
    }
  };
  const delHandler = async (data) => {
    try {
      const response = await ApiCall(
        apiConfig.deleteAuthorization.url,
        apiConfig.deleteAuthorization.method,
        props.credential.loginToken,
        data
      );
      if (response.data.data) setData(response.data.data);
    } catch (error) {
      if (error.response) notify(error.response.data.message, "danger");
      else if (error.request) notify("Request failed", "danger");
      else notify("Something went wrong", "danger");
    }
  };
  const updateCheckAuth = async (value) => {
    var data = {
      key: "checkAuth",
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
      setCheckAuth(value);
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
          apiConfig.readAuthoriztion.url,
          apiConfig.readAuthoriztion.method,
          props.credential.loginToken
        );
        if (response.status === 200) {
          setData(response.data.data);
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
            if (item.key == "checkAuth") {
              setCheckAuth(item.value);
            }
          });
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed ", "danger");
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
                <h3 className="title">Authorization</h3>
              </CardHeader>
              <CardBody>
                <h4 className="title">Toggle checking authorization</h4>
                <div className="d-flex align-items-center">
                  <span className="mr-2">off</span>
                  <CustomInput
                    type="switch"
                    id="switch-5"
                    className="mt-n4"
                    checked={checkAuth}
                    onChange={(e) => updateCheckAuth(e.target.checked)}
                  />
                  <span className="ml-n2">on</span>
                </div>
                <br />
                <br />
                <h4 className="title">Authorization Contracts</h4>
                <p>
                  (User has to purchase at least one NFT collection to use this
                  tool.)
                </p>
                <Button className="btn1" onClick={() => showAddModal()}>
                  + Add
                </Button>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left">Contract</th>
                      <th className="text-left">Amount</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">
                            <a
                              href={`${explorerURL}/address/${item.address}`}
                              target="_blank"
                            >
                              {item.address}
                            </a>
                          </td>
                          <td className="text-left">{item.amount}</td>
                          <td className="text-left">
                            <Button
                              className="btn-link"
                              color="danger"
                              size="sm"
                              onClick={() => delHandler(item)}
                              title="Delete"
                            >
                              <i className="tim-icons icon-simple-remove" />
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
      </div>
      {/* setting modal */}
      <Modal modalClassName="modal-black" isOpen={modalAdd}>
        <div className="modal-header">
          <h4>Authorization Contract</h4>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => closeAddModal()}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
        <div className="modal-body">
          {addData && (
            <Form className="form1">
              <Row>
                <Col className="pr-md-1" md="12">
                  <FormGroup>
                    <label>NFT Contract address</label>
                    <Input
                      type="text"
                      value={addData.address}
                      onChange={(e) => {
                        setAddData({ ...addData, address: e.target.value });
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="pr-md-1" md="12">
                  <FormGroup>
                    <label>Token Amount Needed</label>
                    <Input
                      type="text"
                      value={addData.amount}
                      onChange={(e) => {
                        setAddData({ ...addData, amount: e.target.value });
                      }}
                    />
                  </FormGroup>
                </Col>

                <Col className="pr-md-1" md="12">
                  <Button color="btn1" onClick={() => addHandler()}>
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </div>
      </Modal>
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
    </>
  );
};

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};

export default connect(mapStateToProps)(Authorization);
