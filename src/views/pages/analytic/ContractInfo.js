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
  Modal,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Nav,
} from "reactstrap";
import { add } from "react-big-calendar/lib/utils/dates";
import { addSyntheticTrailingComment } from "typescript";
import Trades from "views/components/ContractInfo/Trades";
import Tokens from "views/components/ContractInfo/Tokens";
import Holders from "views/components/ContractInfo/Holders";
import LiveView from "views/components/ContractInfo/LiveView";

const explorerURL = "https://etherscan.io/";

const ContractInfo = (props) => {
  let { address, type } = useParams();
  const [data, setData] = useState([]);
  const [horizontalTabs, sethorizontalTabs] = React.useState("tab0");
  const [isloading, setIsLoading] = useState(false);
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

  const handleClickTab = (e, tabName) => {
    e.preventDefault();
    sethorizontalTabs(tabName);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const payLoad = {
          address: address,
        };
        const response = await ApiCall(
          apiConfig.getContractInfo.url,
          apiConfig.getContractInfo.method,
          props.credential.loginToken,
          payLoad
        );
        if (response.status === 200) {
          setData((ele) => {
            ele = response.data.data;
            return ele;
          });
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
        <div style={{ padding: "15px 7%" }}>
          {isloading ? (
            <div style={{ textAlign: "center" }}>
              <p>please wait while loading....</p>
            </div>
          ) : (
            <Row>
              <Col md={6}>
                <Card>
                  <CardBody
                    style={{
                      padding: "6%",
                      minHeight: "250px",
                      overflow: "auto",
                    }}
                  >
                    <Row>
                      <Col md={4}>
                        <img src={data.unsafeOpenseaImageUrl} />
                      </Col>
                      <Col md={8}>
                        <p
                          style={{
                            fontSize: "20px",
                            margin: "0px 0px",
                            fontWeight: "bold",
                          }}
                        >
                          {data.name}({data.symbol})
                        </p>
                        <p style={{ fontSize: "15px", margin: "8px 0px" }}>
                          <a
                            href={explorerURL + "/address/" + address}
                            target={"_blank"}
                          >
                            {data.address}
                          </a>
                        </p>
                        <p style={{ fontSize: "13px", margin: "8px 0px" }}>
                          Token Standard: {data.tokenStandard}
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <CardBody
                    style={{
                      padding: "6%",
                      minHeight: "250px",
                      overflow: "auto",
                    }}
                  >
                    <p style={{ fontSize: "20px", margin: "8px 0px" }}>
                      Collection Info
                    </p>
                    <a
                      href={explorerURL + "/address/" + address}
                      target={"_blank"}
                    >
                      <Button
                        style={{ marginRight: "8px" }}
                        color="info"
                        size="sm"
                      >
                        Etherscan
                      </Button>
                    </a>
                    <p style={{ fontSize: "20px", margin: "8px 0px" }}>
                      Buy now
                    </p>
                    <a
                      href={`https://opensea.io/collection/${data.unsafeOpenseaSlug}`}
                      target={"_blank"}
                    >
                      <Button
                        style={{ marginRight: "8px" }}
                        color="info"
                        size="sm"
                      >
                        Opensea
                      </Button>
                    </a>
                    <a
                      href={`https://looksrare.org/collections/${data.address}`}
                      target={"_blank"}
                    >
                      <Button
                        style={{ marginRight: "8px" }}
                        color="info"
                        size="sm"
                      >
                        LooksRare
                      </Button>
                    </a>
                    <a
                      href={`https://genie.xyz/collection/${data.address}`}
                      target={"_blank"}
                    >
                      <Button
                        style={{ marginRight: "8px" }}
                        color="info"
                        size="sm"
                      >
                        genie.xyz
                      </Button>
                    </a>
                    <a
                      href={`https://gem.xyz/collection/${data.address}`}
                      target={"_blank"}
                    >
                      <Button
                        style={{ marginRight: "8px" }}
                        color="info"
                        size="sm"
                      >
                        gem.xyz
                      </Button>
                    </a>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <CardBody style={{ padding: "15px 15%" }}>
                    <h4>24HR VOLUME</h4>
                    <h3 style={{ fontWeight: "bold" }}>Ξ {data.volume}</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <CardBody style={{ padding: "15px 15%" }}>
                    <h4>24HR SALES</h4>
                    <h3 style={{ fontWeight: "bold" }}>{data.totalSales}</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <CardBody style={{ padding: "15px 15%" }}>
                    <h4>24HR SALES FLOOR</h4>
                    <h3 style={{ fontWeight: "bold" }}>Ξ {data.floor}</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <CardBody style={{ padding: "15px 15%" }}>
                    <h4>24HR AVERAGE</h4>
                    <h3 style={{ fontWeight: "bold" }}>Ξ {data.average}</h3>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          {/* Tabs */}
          {type == "top" && (
            <Row>
              <Col>
                <Card>
                  <CardHeader></CardHeader>
                  <CardBody>
                    <Nav className="nav-pills-info" pills>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#pablo"
                          className={horizontalTabs === "tab0" ? "active" : ""}
                          onClick={(e) => handleClickTab(e, "tab0")}
                        >
                          Live View
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#pablo"
                          className={horizontalTabs === "tab1" ? "active" : ""}
                          onClick={(e) => handleClickTab(e, "tab1")}
                        >
                          Summary
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#pablo"
                          className={horizontalTabs === "tab2" ? "active" : ""}
                          onClick={(e) => handleClickTab(e, "tab2")}
                        >
                          Tokens
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#pablo"
                          className={horizontalTabs === "tab3" ? "active" : ""}
                          onClick={(e) => handleClickTab(e, "tab3")}
                        >
                          Holders
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent
                      className="tab-space"
                      activeTab={horizontalTabs}
                    >
                      <TabPane tabId="tab0">
                        <LiveView address={address} />
                      </TabPane>
                      <TabPane tabId="tab1">
                        <Trades address={address} />
                      </TabPane>
                      <TabPane tabId="tab2">
                        <Tokens
                          address={address}
                          defaultImage={data.unsafeOpenseaImageUrl}
                        />
                      </TabPane>
                      <TabPane tabId="tab3">
                        <Holders address={address} />
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};

export default connect(mapStateToProps)(ContractInfo);
