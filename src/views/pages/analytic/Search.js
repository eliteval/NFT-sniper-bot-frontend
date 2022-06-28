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

const Search = (props) => {
  const [searched_collections, setSearchedCollections] = useState([]);
  const [query, setQuery] = useState("");
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
  const searchContract = async (keyword) => {
    try {
      var payLoad = { query: keyword };
      const response = await ApiCall(
        apiConfig.searchContracts.url,
        apiConfig.searchContracts.method,
        props.credential.loginToken,
        payLoad
      );
      if (response.status === 200) {
        setSearchedCollections((ele) => {
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

  useEffect(() => {}, []);

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
                <h3>Search Collections</h3>
                <Row>
                  <Col md={5}>
                    <Input
                      type="text"
                      placeholder="Search NFT contracts by name..."
                      size={"lg"}
                      style={{ padding: "3px" }}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      style={{ marginRight: "8px" }}
                      color="info"
                      size="md"
                      onClick={() => searchContract(query)}
                    >
                      Search
                    </Button>
                  </Col>
                </Row>

                <Table responsive style={{ marginTop: "20px" }}>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left"></th>
                      <th className="text-left">Name</th>
                      <th className="text-left">Symbol</th>
                      <th className="text-left">Address</th>
                      <th className="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searched_collections.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">
                            <img
                              src={item.node.unsafeOpenseaImageUrl}
                              width={50}
                            />
                          </td>
                          <td className="text-left">{item.node.name}</td>
                          <td className="text-left">{item.node.symbol}</td>
                          <td className="text-left">
                            {item.node.address}
                            <a
                              href={`${explorerURL}/address/${item.node.address}`}
                              target={"_blank"}
                            >
                              &nbsp; <i className="tim-icons icon-link-72" />
                            </a>
                          </td>
                          <td className="text-left">
                            <a href={"/bot/contract/" + item.node.address+"/search"}>
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

export default connect(mapStateToProps)(Search);
