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

const Trades = (props) => {
  let { address, defaultImage } = props;
  const [tokens, setTokens] = useState([]);
  const [types, setTypes] = useState([]); //custom
  const [values, setValues] = useState([]); //custom
  const [traitsData, setTraitsData] = useState([]); //db
  const [traitFilter, setTraitsFilter] = useState([]); // filter
  const [rankFilter, setRankFilter] = useState({
    min: "",
    max: "",
  }); // filter
  const [tokenidFilter, setTokenIDFilter] = useState({
    min: "",
    max: "",
  }); // filter
  const perpage = 12; //pagination
  const [pagenumber, setPageNumber] = useState(1); //pagination
  const [pagination, setPagination] = useState({
    total: 0,
  });
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

  //handle click pagination
  const handleClickFirst = () => {
    setPageNumber(1);
  };
  const handleClickLast = () => {
    var lastPageNumber = Math.ceil(pagination.total / perpage);
    setPageNumber(lastPageNumber);
  };
  const handleClickPrev = () => {
    setPageNumber(Math.max(1, pagenumber - 1));
  };
  const handleClickNext = () => {
    var lastPageNumber = Math.ceil(pagination.total / perpage);
    setPageNumber(Math.min(lastPageNumber, pagenumber + 1));
  };
  //handle check/uncheck trait
  const handleClikTraitValue = (type, value) => {
    var exist = traitFilter.find((item) => {
      return item[0] == type && item[1] == value;
    });
    if (exist)
      setTraitsFilter(
        traitFilter.filter((item) => !(item[0] == type && item[1] == value))
      );
    else setTraitsFilter([...traitFilter, [type, value]]);
  };

  //get traits
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const payLoad = {
          address: address,
        };
        const response = await ApiCall(
          apiConfig.getTraits.url,
          apiConfig.getTraits.method,
          props.credential.loginToken,
          payLoad
        );
        if (response.status === 200) {
          setTraitsData((ele) => {
            ele = response.data.data;
            console.log("traitsData", ele);
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
  //set types, values
  useEffect(() => {
    var typearr = [];
    traitsData.map((item) => typearr.push(item.type));
    typearr = typearr.filter(function (item, pos) {
      return typearr.indexOf(item) == pos;
    });
    setTypes(typearr);

    var pairarr = [];
    typearr.map((item) => {
      var aaa = [];
      traitsData
        .filter((ii) => {
          return ii.type == item;
        })
        .map((iii) => {
          aaa.push([iii.value, iii.rarity]);
        });
      pairarr[item] = aaa;
    });
    console.log("values", pairarr);
    setValues(pairarr);
  }, [traitsData]);
  //refresh when filter
  useEffect(() => {
    setPageNumber(1);
  }, [traitFilter]);

  //get tokens
  useEffect(() => {
    (async () => {
      try {
        const payLoad = {
          address: address,
          filter: {
            traits: traitFilter,
            rank: rankFilter,
            token_id: tokenidFilter
          },
          pagination: {
            pagenumber: pagenumber,
            perpage: perpage,
          },
        };
        const response = await ApiCall(
          apiConfig.getTokens.url,
          apiConfig.getTokens.method,
          props.credential.loginToken,
          payLoad
        );
        if (response.status === 200) {
          setTokens((ele) => {
            ele = response.data.data;
            console.log("tokens", ele);
            return ele;
          });
          setPagination({
            ...pagination,
            total: response.data.total,
          });
          setIsLoading(false);
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed in getting data.", "danger");
      }
    })();
  }, [pagenumber, traitFilter, rankFilter, tokenidFilter]);

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
            <h5>
              Showing {(pagenumber - 1) * perpage + 1} ~{" "}
              {Math.min(pagenumber * perpage, pagination.total)} of{" "}
              {pagination.total}
            </h5>
            <Row>
              <Col md="8">
                {/* Tokens */}
                <Row>
                  {tokens.map((item, key) => {
                    return (
                      <Col md={3}>
                        <Card
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setModalData(item);
                            setModalShow(true);
                          }}
                        >
                          <CardBody>
                            <img
                              src={item.image ? item.image : defaultImage}
                              width="100%"
                              style={{
                                filter: item.image ? "" : "blur(3px)",
                                marginBottom: "15px",
                              }}
                            />
                            <h5
                              style={{
                                marginTop: "15px!important",
                                fontWeight: "bold",
                              }}
                            >
                              {item.name}
                            </h5>
                            <p>tokenID: {item.token_id}</p>
                            <h5
                              style={{
                                color: "pink",
                              }}
                            >
                              Rank: #{item.rarity_rank}
                            </h5>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
                {/* Pagination */}
                <Pagination>
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Previous"
                      href="#pablo"
                      onClick={(e) => handleClickFirst()}
                    >
                      <span
                        aria-hidden={true}
                        className={pagenumber == 1 ? "text-muted" : ""}
                      >
                        <i
                          aria-hidden={true}
                          className="tim-icons icon-double-left"
                        />
                      </span>
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Previous"
                      href="#pablo"
                      onClick={(e) => handleClickPrev()}
                    >
                      <span
                        aria-hidden={true}
                        className={pagenumber == 1 ? "text-muted" : ""}
                      >
                        <i
                          aria-hidden={true}
                          className="tim-icons icon-minimal-left"
                        />
                      </span>
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Previous"
                      href="#pablo"
                      onClick={(e) => handleClickNext()}
                    >
                      <span
                        aria-hidden={true}
                        className={
                          pagenumber == Math.ceil(pagination.total / perpage)
                            ? "text-muted"
                            : ""
                        }
                      >
                        <i
                          aria-hidden={true}
                          className="tim-icons icon-minimal-right

                          "
                        />
                      </span>
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Next"
                      href="#pablo"
                      onClick={(e) => handleClickLast()}
                    >
                      <span
                        aria-hidden={true}
                        className={
                          pagenumber == Math.ceil(pagination.total / perpage)
                            ? "text-muted"
                            : ""
                        }
                      >
                        <i
                          aria-hidden={true}
                          className="tim-icons icon-double-right"
                        />
                      </span>
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </Col>
              <Col md="4">
                <h4>Token ID</h4>
                <Row>
                  <Col>
                    <label>Min</label>
                    <FormGroup>
                      <Input
                        type="number"
                        min="0"
                        value={tokenidFilter.min}
                        onChange={(e) =>
                          setTokenIDFilter({
                            ...tokenidFilter,
                            min: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <label>Max</label>
                    <FormGroup>
                      <Input
                        type="number"
                        min="0"
                        value={tokenidFilter.max}
                        onChange={(e) =>
                          setTokenIDFilter({
                            ...tokenidFilter,
                            max: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h4>Rarity Rank</h4>
                <Row>
                  <Col>
                    <label>Min</label>
                    <FormGroup>
                      <Input
                        type="number"
                        min="0"
                        value={rankFilter.min}
                        onChange={(e) =>
                          setRankFilter({ ...rankFilter, min: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <label>Max</label>
                    <FormGroup>
                      <Input
                        type="number"
                        min="0"
                        value={rankFilter.max}
                        onChange={(e) =>
                          setRankFilter({ ...rankFilter, max: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h4>Traits</h4>
                {/* Traits collapse */}
                <div
                  aria-multiselectable={true}
                  className="card-collapse"
                  id="accordion"
                  role="tablist"
                >
                  {types.map((type) => {
                    return (
                      <CollapseMenu
                        type={type}
                        valuearr={values[type]}
                        traitFilter={traitFilter}
                        handleClikTraitValue={handleClikTraitValue}
                      />
                    );
                  })}
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
        <div className="modal-body">
          <h4>{modalData.name}</h4>
          <h6>Token ID: &ensp;{modalData.token_id}</h6>
          <h6>
            Owner: &ensp;
            <a
              href={explorerURL + "/address/" + modalData.owner}
              target={"_blank"}
            >
              {shortenWallet(modalData.owner)}
            </a>
          </h6>

          <Row>
            <Col>
              <img
                src={modalData.image ? modalData.image : defaultImage}
                width="100%"
                style={{
                  filter: modalData.image ? "" : "blur(3px)",
                  marginBottom: "15px",
                }}
              />
              <a
                href={`https://opensea.io/assets/ethereum/${modalData.token_address}/${modalData.token_id}`}
                target={"_blank"}
              >
                <Button style={{ marginRight: "8px" }} color="info" size="sm">
                  <i className="tim-icons icon-link-72" /> Opensea
                </Button>
              </a>
            </Col>
            <Col>
              {modalData.attributes &&
                modalData.attributes.map((item) => {
                  var rarity = 0;
                  for (var x in traitsData) {
                    if (
                      traitsData[x].type.toLowerCase() ==
                        item.trait_type.toLowerCase() &&
                      traitsData[x].value.toLowerCase() ==
                        item.value.toLowerCase()
                    ) {
                      rarity = traitsData[x].rarity;
                      break;
                    }
                  }
                  return (
                    <>
                      <Row>
                        <Col>
                          <small>{item.trait_type}</small>
                          <h6>{item.value}</h6>
                        </Col>
                        <Col>
                          <p style={{ marginTop: "14px" }}>
                            {(rarity * 100).toFixed(1)}%
                          </p>
                        </Col>
                      </Row>
                    </>
                  );
                })}
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

const CollapseMenu = (props) => {
  const { type, valuearr, traitFilter, handleClikTraitValue } = props;
  const [openedCollapseOne, setopenedCollapseOne] = useState(false);

  const checkDisplay = (type, value) => {
    var checked = false;
    traitFilter.map((item) => {
      if (item[0] == type && item[1] == value) checked = true;
    });
    return checked;
  };
  return (
    <Card className="card-plain">
      <CardHeader role="tab">
        <a
          aria-expanded={openedCollapseOne}
          href="#pablo"
          data-parent="#accordion"
          data-toggle="collapse"
          onClick={(e) => {
            e.preventDefault();
            setopenedCollapseOne(!openedCollapseOne);
          }}
        >
          {type} ({traitFilter.filter((item) => item[0] == type).length}{" "}
          filters)
          <i className="tim-icons icon-minimal-down" />
        </a>
      </CardHeader>
      <Collapse role="tabpanel" isOpen={openedCollapseOne}>
        <CardBody
          style={{ padding: "10%", maxHeight: "300px", overflow: "auto" }}
        >
          {valuearr.map((item) => {
            return (
              <>
                <Row
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleClikTraitValue(type, item[0]);
                  }}
                >
                  <Col sm="5">{item[0]}</Col>
                  <Col sm="5">{(item[1] * 100).toFixed(1)}%</Col>
                  <Col sm="2">
                    {checkDisplay(type, item[0]) && (
                      <p className="text-success">
                        <i className="tim-icons icon-check-2" />
                      </p>
                    )}
                  </Col>
                </Row>
                <hr />
              </>
            );
          })}
        </CardBody>
      </Collapse>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};

export default connect(mapStateToProps)(Trades);
