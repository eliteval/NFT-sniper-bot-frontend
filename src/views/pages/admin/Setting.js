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

const Setting = (props) => {
  const [terms, setTerms] = useState(false);
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
  const [addData, setAddData] = useState("");
  const showAddModal = (data = false) => {
    setModalAdd(true);
  };
  const closeAddModal = () => {
    setModalAdd(false);
  };

  const updateTerms = async () => {
    var data = {
      key: "terms",
      value: terms,
    };
    try {
      const response = await ApiCall(
        apiConfig.update_setting.url,
        apiConfig.update_setting.method,
        props.credential.loginToken,
        data
      );
      notify("done", "success");
    } catch (error) {
      if (error.response) notify(error.response.data.message, "danger");
      else if (error.request) notify("Request failed", "danger");
      else notify("Something went wrong", "danger");
    }
    setModalAdd(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await ApiCall(
          apiConfig.read_setting.url,
          apiConfig.read_setting.method,
          props.credential.loginToken
        );
        if (response.status === 200) {
          response.data.data.map((item, key) => {
            if (item.key == "terms") {
              setTerms(item.value);
            }
          });
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed in getting wallets.", "danger");
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
                <h3 className="title">Settingss</h3>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left">Setting</th>
                      <th className="text-left">Value</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-left">Terms & Condition Link</td>
                      <td className="text-left">{terms}</td>
                      <td className="text-left">
                        <Button
                          className="btn-link"
                          color="success"
                          size="sm"
                          onClick={() => showAddModal()}
                          title="Edit"
                        >
                          <i className="tim-icons icon-bullet-list-67" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
      {/* modal */}
      <Modal modalClassName="modal-black" isOpen={modalAdd}>
        <div className="modal-header">
          <h4>Setting</h4>
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
          <Form className="form1">
            <Row>
              <Col className="pr-md-1" md="12">
                <FormGroup>
                  <label>Terms & Conditions Link</label>
                  <Input
                    type="text"
                    value={terms}
                    onChange={(e) => {
                      setTerms(e.target.value);
                    }}
                  />
                </FormGroup>
              </Col>

              <Col className="pr-md-1" md="12">
                <Button color="btn1" onClick={() => updateTerms()}>
                  Save
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

export default connect(mapStateToProps)(Setting);
