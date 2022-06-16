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
  const [tokens, setTokens] = useState([]); // showing
  const [tokensData, setTokensData] = useState([]); //whole
  const [types, setTypes] = useState([]); //custom
  const [values, setValues] = useState([]); //custom
  const [traitsData, setTraitsData] = useState([]); //db
  const [traitFilter, setTraitsFilter] = useState([]); //
  const [pagination, setPagination] = useState({
    rows: 12,
    pagenumber: 1,
    pageArr: [1, 2, 3],
  });
  const [openedCollapseOne, setopenedCollapseOne] = useState(false);
  const [openedCollapseTwo, setopenedCollapseTwo] = useState(false);
  const [openedCollapseThree, setopenedCollapseThree] = useState(false);
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

  const handleClickFirst = () => {
    setPagination({
      ...pagination,
      pagenumber: 1,
      pageArr: [1, 2, 3],
    });
  };
  const handleClickLast = () => {
    var lastPageNumber = Math.ceil(tokens.length / pagination.rows);
    setPagination({
      ...pagination,
      pagenumber: lastPageNumber,
      pageArr: [lastPageNumber - 2, lastPageNumber - 1, lastPageNumber],
    });
  };

  const handleClickNumber = (num) => {
    var lastPageNumber = Math.ceil(tokens.length / pagination.rows);
    var middlenumber = num;
    if (num == 1) middlenumber = 2;
    if (num == lastPageNumber) middlenumber = lastPageNumber - 1;
    setPagination({
      ...pagination,
      pagenumber: num,
      pageArr: [middlenumber - 1, middlenumber, middlenumber + 1],
    });
  };

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

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const payLoad = {
          address: address,
        };
        const response = await ApiCall(
          apiConfig.getTokens.url,
          apiConfig.getTokens.method,
          props.credential.loginToken,
          payLoad
        );
        if (response.status === 200) {
          setTokensData((ele) => {
            ele = response.data.data;
            console.log("tokens", ele);
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
            console.log(ele);
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
    console.log(pairarr);
    setValues(pairarr);
    // traitsData.map((item) => {
    //   typearr.push(item.type);
    // });
  }, [traitsData]);

  //Filter tokens
  useEffect(() => {
    setTokens(
      tokensData.filter((item) => {
        var metadata = JSON.parse(item.metadata);
        var attributes = metadata?.attributes;
        if (traitFilter.length == 0) return true;
        if (!attributes) return false;
        var matched = false;
        attributes.map((ii) => [
          traitFilter.map((filter) => {
            if (
              ii.trait_type == filter[0] &&
              ii.value.toLowerCase() == filter[1]
            )
              matched = true;
          }),
        ]);

        return matched;
      })
    );
  }, [tokensData, traitFilter]);

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
              Showing {traitFilter.length ? " by Filters " : " All "}(
              {(pagination.pagenumber - 1) * pagination.rows + 1} ~{" "}
              {Math.min(pagination.pagenumber * pagination.rows, tokens.length)}{" "}
              among {tokens.length})
            </h5>
            <Row>
              <Col md="8">
                <Row>
                  {tokens.map((item, key) => {
                    if (
                      key >= (pagination.pagenumber - 1) * pagination.rows &&
                      key < pagination.pagenumber * pagination.rows
                    ) {
                      var metadata = JSON.parse(item.metadata);
                      var name = metadata?.name;
                      var image = metadata?.image;
                      if (image)
                        image = image.replace(
                          "ipfs://",
                          "https://ipfs.io/ipfs/"
                        );
                      var ifHasImage = image ? true : false;
                      return (
                        <Col md={3}>
                          <Card style={{ cursor: "pointer" }}>
                            <CardBody>
                              <img
                                src={ifHasImage ? image : defaultImage}
                                width="100%"
                                style={{
                                  filter: ifHasImage ? "" : "blur(3px)",
                                  marginBottom: "15px",
                                }}
                              />
                              <h5
                                style={{
                                  marginTop: "15px!important",
                                  fontWeight: "bold",
                                }}
                              >
                                {name}
                              </h5>
                            </CardBody>
                          </Card>
                        </Col>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </Row>
                <Pagination>
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Previous"
                      href="#pablo"
                      onClick={(e) => handleClickFirst()}
                    >
                      <span aria-hidden={true}>
                        <i
                          aria-hidden={true}
                          className="tim-icons icon-double-left"
                        />
                      </span>
                    </PaginationLink>
                  </PaginationItem>
                  {pagination.pageArr.map((item) => {
                    return (
                      <PaginationItem
                        className={
                          pagination.pagenumber == item ? "active" : ""
                        }
                      >
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => handleClickNumber(item)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationLink
                      aria-label="Next"
                      href="#pablo"
                      onClick={(e) => handleClickLast()}
                    >
                      <span aria-hidden={true}>
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
                <h4>Traits</h4>
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
                  <Col sm="3">{(item[1] * 100).toFixed(1)}%</Col>
                  <Col sm="4">
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
