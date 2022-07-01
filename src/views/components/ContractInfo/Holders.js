import { connect } from "react-redux";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Collapse,
  Modal,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Nav,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import Chart from "react-apexcharts";
const explorerURL = "https://etherscan.io/";

const Holders = (props) => {
  let { address } = props;
  const [holdersdata, setHoldersData] = useState([]);
  const [tokens, setTokens] = useState(0);
  const [holders, setHolders] = useState(0);
  const [avg_owned, setAvgOwned] = useState(0);
  const [unique_percent, setUniquePercent] = useState(0);
  const [holders1, setHolders1] = useState(0);
  const [holders2_5, setHolders2_5] = useState(0);
  const [holders6_20, setHolders6_20] = useState(0);
  const [holders21_50, setHolders21_50] = useState(0);
  const [holders51, setHolders51] = useState(0);
  const [isloading, setIsLoading] = useState(true);
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

  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState({});

  //get holdersdata
  useEffect(() => {
    (async () => {
      try {
        const payLoad = {
          address: address,
        };
        const response = await ApiCall(
          apiConfig.getHolders.url,
          apiConfig.getHolders.method,
          props.credential.loginToken,
          payLoad
        );
        if (response.status === 200) {
          setHoldersData((ele) => {
            ele = response.data.data;
            console.log("holdersdata", ele);
            return ele;
          });
          setTokens(response.data.tokens_count);
          setHolders(response.data.holders);
          setAvgOwned(response.data.avg_owned);
          setUniquePercent(response.data.unique_percent);
          setHolders1(response.data.holders1);
          setHolders2_5(response.data.holders2_5);
          setHolders6_20(response.data.holders6_20);
          setHolders21_50(response.data.holders21_50);
          setHolders51(response.data.holders51);

          setIsLoading(false);
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed in getting data.", "danger");
      }
    })();
  }, [address]);

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>

      <div className="content">
        {isloading ? (
          <div style={{ textAlign: "center" }}>
            <p>please wait while loading....</p>
          </div>
        ) : (
          <>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <h4 className="text-muted">Circulating Supply</h4>
                    <h3>{tokens}</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardBody>
                    <h4 className="text-muted">Unique Holders</h4>
                    <h3>{holders}</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardBody>
                    <h4 className="text-muted">Percent of Unique Holders</h4>
                    <h3>{Number(unique_percent).toFixed(1)}%</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardBody>
                    <h4 className="text-muted">Average Owned per Wallet</h4>
                    <h3>{avg_owned.toFixed(1)}</h3>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col sm="4">
                <h3>Holder Distribution</h3>
                <Table>
                  <thead>
                    <tr>
                      <th>Number of holding tokens</th>
                      <th>Number of owners</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>{holders1}</td>
                    </tr>
                    <tr>
                      <td>2 ~ 5</td>
                      <td>{holders2_5}</td>
                    </tr>
                    <tr>
                      <td>6 ~ 20</td>
                      <td>{holders6_20}</td>
                    </tr>
                    <tr>
                      <td>21 ~ 50</td>
                      <td>{holders21_50}</td>
                    </tr>
                    <tr>
                      <td>over 50</td>
                      <td>{holders51}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col sm="8">
                <h3>Top Holders</h3>
                <div style={{ height: "500px", overflow: "auto" }}>
                  <Table>
                    <thead>
                      <tr>
                        <th>Holder</th>
                        <th>Owns</th>
                        <th>% of Supply</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdersdata.map((item) => {
                        return (
                          <>
                            <tr>
                              <td>{item._id}</td>
                              <td>{item.count}</td>
                              <td>
                                {((item.count / tokens) * 100).toFixed(1)} %
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>

      {/* setting modal */}
      <Modal modalClassName="modal-black" isOpen={modalShow} size="lg">
        <div className="modal-header">
          <h4>Token Details</h4>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setModalShow(false)}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
        <div className="modal-body"></div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};

export default connect(mapStateToProps)(Holders);
