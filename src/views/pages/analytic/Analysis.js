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

const Analysis = (props) => {
  const [trending_collections, setTrendginCollections] = useState([]);
  const [timeframe, setTimeFrame] = useState(1);
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

  const handleChangeTimeFrame = async (timeframe) => {
    setTimeFrame(timeframe);
    getTrendingCollections(timeframe);
  };
  const getTrendingCollections = async (timeframe = 1) => {
    try {
      const response = await ApiCall(
        apiConfig.getTrendingCollections.url,
        apiConfig.getTrendingCollections.method,
        props.credential.loginToken,
        { timeframe: timeframe }
      );
      if (response.status === 200) {
        setTrendginCollections((ele) => {
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
      await getTrendingCollections(1);
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
                    Trending NFT collections
                  </span>
                  <a href={"/bot/search"}>
                    <Button
                      style={{ marginLeft: "18px" }}
                      color="info"
                      size="sm"
                    >
                      Search
                    </Button>
                  </a>
                  <ButtonGroup
                    className="btn-group-toggle float-right"
                    data-toggle="buttons"
                  >
                    <Button
                      color="info"
                      id="0"
                      size="sm"
                      tag="label"
                      className={
                        "btn-simple " + (timeframe == 1 ? "active" : "")
                      }
                      onClick={() => handleChangeTimeFrame(1)}
                    >
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        1h
                      </span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-single-02" />
                      </span>
                    </Button>
                    <Button
                      color="info"
                      id="1"
                      size="sm"
                      tag="label"
                      className={
                        "btn-simple " + (timeframe == 4 ? "active" : "")
                      }
                      onClick={() => handleChangeTimeFrame(4)}
                    >
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        4h
                      </span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-gift-2" />
                      </span>
                    </Button>
                    <Button
                      color="info"
                      id="2"
                      size="sm"
                      tag="label"
                      className={
                        "btn-simple " + (timeframe == 24 ? "active" : "")
                      }
                      onClick={() => handleChangeTimeFrame(24)}
                    >
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        1d
                      </span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-tap-02" />
                      </span>
                    </Button>
                    <Button
                      color="info"
                      id="2"
                      size="sm"
                      tag="label"
                      className={
                        "btn-simple " + (timeframe == 7 * 24 ? "active" : "")
                      }
                      onClick={() => handleChangeTimeFrame(7 * 24)}
                    >
                      <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        7d
                      </span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-tap-02" />
                      </span>
                    </Button>
                  </ButtonGroup>
                </div>
                {/* <a class="pull-right" href={"/bot/search/"}>
                  <Button style={{ marginRight: "8px" }} color="info" size="sm">
                    Search Collections
                  </Button>
                </a> */}
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left">No</th>
                      <th className="text-left"></th>
                      <th className="text-left">Name (Symbol)</th>
                      <th className="text-left">Address</th>
                      <th className="text-left">
                        Sales &nbsp;
                        <span title="Sales for the selected timeframe.">
                          <i class="tim-icons icon-wifi"></i>
                        </span>
                      </th>
                      <th className="text-left">
                        Sales Floor &nbsp;
                        <span title="Lowest recent sale with outliers removed.">
                          <i class="tim-icons icon-wifi"></i>
                        </span>
                      </th>
                      <th className="text-left">
                        AVERAGE &nbsp;
                        <span title="Average sale price for the selected timeframe.">
                          <i class="tim-icons icon-wifi"></i>
                        </span>
                      </th>
                      <th className="text-left">
                        Volume &nbsp;
                        <span title="Total volume for the selected timeframe.">
                          <i class="tim-icons icon-wifi"></i>
                        </span>
                      </th>
                      <th className="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trending_collections.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{key + 1}</td>
                          <td className="text-left">
                            <img
                              src={item.unsafeOpenseaImageUrl}
                              width={"70px"}
                            />
                          </td>
                          <td className="text-left">
                            {item.name} ({item.symbol})
                          </td>
                          <td className="text-left">
                            {item.address}
                            <a
                              href={`${explorerURL}/address/${item.address}`}
                              target={"_blank"}
                            >
                              &nbsp; <i className="tim-icons icon-link-72" />
                            </a>
                          </td>
                          <td className="text-left">{item.totalSales}</td>
                          <td className="text-left">{item.floor} </td>
                          <td className="text-left">{item.average}</td>
                          <td className="text-left">{item.volume} </td>
                          <td className="text-left">
                            <a href={"/bot/contract/" + item.address + "/top"}>
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

export default connect(mapStateToProps)(Analysis);
