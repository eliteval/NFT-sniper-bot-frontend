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
const explorerURL = "https://etherscan.io/";

const TopCollections = (props) => {
  const [top_collections, setTopCollections] = useState([]);
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
  const getTopCollections = async () => {
    try {
      const response = await ApiCall(
        apiConfig.getTop100Collections.url,
        apiConfig.getTop100Collections.method,
        props.credential.loginToken
      );
      if (response.status === 200) {
        setTopCollections((ele) => {
          ele = response.data.data;
          return ele;
        });
      } else {
        notify(response.data.message, "danger");
      }
    } catch (error) {
      if (error.response) notify(error.response.data.message, "danger");
      else if (error.request) notify("Request failed", "danger");
      else notify("Something went wrong", "danger");
    }
  };
  useEffect(() => {
    (async () => {
      await getTopCollections();
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
                <div style={{ margin: "20px" }}>
                  <span
                    className="title"
                    style={{ fontSize: "30px", color: "white" }}
                  >
                    Top NFT collections
                  </span>
                </div>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left"></th>
                      {/* <th className="text-left"></th> */}
                      <th className="text-left">Contract</th>
                      <th className="text-left">Holders</th>
                      <th className="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top_collections.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.rank}</td>
                          {/* <td className="text-left">
                            <img src={item.iconUrl} width={"30px"} />
                          </td> */}
                          <td className="text-left">
                            {item.contractAddress}
                            <a
                              href={`${explorerURL}/address/${item.contractAddress}`}
                              target={"_blank"}
                            >
                              &nbsp; <i className="tim-icons icon-link-72" />
                            </a>
                          </td>
                          <td className="text-left">
                            {Number(item.marketCap).toLocaleString()} {item.currency}
                          </td>
                          <td className="text-left">{item.holders}</td>
                          <td className="text-left">{item.sellers} </td>
                          <td className="text-left">
                            {item.owners > 0 && item.owners}
                          </td>
                          <td className="text-left">{item.transactions} </td>
                          <td className="text-left">
                            <a href={"/bot/contract/" + item.contractAddress + "/top"}>
                              <Button
                                style={{ marginRight: "8px" }}
                                color="info"
                                size="sm"
                              >
                                More
                              </Button>
                            </a>
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

export default connect(mapStateToProps)(TopCollections);
