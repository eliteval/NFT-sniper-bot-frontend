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

  useEffect(() => {
    (async () => {
      try {
        const response = await ApiCall(
          apiConfig.getTrendingCollections.url,
          apiConfig.getTrendingCollections.method,
          props.credential.loginToken
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
                {/* <h5 className="title">Manage Wallet</h5> */}
              </CardHeader>
              <CardBody>
                <h3 className="title">Trending NFT collections</h3>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left"></th>
                      <th className="text-left">Name (Symbol)</th>
                      <th className="text-left">Address</th>
                      <th className="text-left">
                        Sales &nbsp;
                        <span title="Sales for the last 1 hour.">
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
                        <span title="Average sale price for the last 1 hour.">
                          <i class="tim-icons icon-wifi"></i>
                        </span>
                      </th>
                      <th className="text-left">
                        Volume &nbsp;
                        <span title="Total volume for the last 1 hour.">
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
                          <td className="text-left">
                            <img src={item.unsafeOpenseaImageUrl} width={70} />
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
                            <Button
                              style={{ marginRight: "8px" }}
                              color="primary"
                              size="sm"
                              onClick={() => {
                                window.location.href =
                                  "/bot/nft_bot/" + item.address;
                              }}
                            >
                              Snipe
                            </Button>
                            <a href={"/bot/contract/" + item.address}>
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
