import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
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
// react component used to create sweet alerts
import classNames from "classnames";
import io from "socket.io-client";
import { connect } from "react-redux";
import ReactDatetime from "react-datetime";
import Select from "react-select";
import ReactTable from "components/ReactTable/ReactTable.js";
import "./sniper.css";
import NotificationAlert from "react-notification-alert";
import snip_image from "assets/img/sniper1.jpg";
const NFTSniperBot = (props) => {
  //necessary functions import
  const { apiConfig, ApiCall } = global;
  const [socket, setSocket] = useState("");
  const notificationAlertRef = React.useRef(null);
  const showNotify = async (
    title,
    text,
    type = "success",
    place = "tr",
    autoDismiss = 5
  ) => {
    const options = {
      place: place,
      message: (
        <div>
          <div>{title}</div>
          <div>{text}</div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: autoDismiss,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  const baseTokenSymbol = "ETH";
  const explorerURL = "https://etherscan.io/";
  // const explorerURL = "https://testnet.bscscan.com/";
  //for plan
  const [plans, setPlan] = useState([]);
  //setting modal
  const [modalAdd, setModalAdd] = useState(false);
  const [addData, setAddData] = useState({});
  const arrSniperTrigger = {
    flipstate: "Snipe NFT Token when flipstate function is called",
    statuschange: "Snipe NFT Tokens when sale status is changed",
    idrange: "Snipe NFT Tokens with ID range",
  };
  const showAddModal = (data = false) => {
    if (data) setAddData(data);
    else
      setAddData({
        waitTime: 10,
        delayMethod: "second",
        eth: "0.3",
        gasPrice: 12, // gwei
        gasLimit: 3000000, // number
        token: "",
        startFunction: "",
        mintFunction: "",
        extraWallet: "",
        tokenAmount: 1,
        sniperTrigger: "flipstate",
        saleStatus: '',
        rangeStart: '',
        rangeEnd: '',
      });
    setModalAdd(true);
  };
  const closeAddModal = () => {
    setModalAdd(false);
  };
  //detail modal(for logs)
  const [detailModalStatus, setDetailModalStatus] = useState(false);
  const [detailData, setDetailData] = useState(false);
  const showDetailModal = (data) => {
    setDetailModalStatus(true);
    setDetailData(JSON.parse(JSON.stringify(data)));
  };
  const closeDetailModal = () => {
    setDetailModalStatus(false);
  };
  //error modal(for error)
  const [errorModalStatus, setErrorModalStatus] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const showErrorModal = (data) => {
    setErrorModalStatus(true);
    setErrorData(JSON.parse(JSON.stringify(data)));
  };
  const closeErrorModal = () => {
    setErrorModalStatus(false);
  };
  //log table
  const [logData, setLogData] = useState([]);
  //func handler
  const addHandler = async () => {
    try {
      const response = await ApiCall(
        apiConfig.nft_addBot.url,
        apiConfig.nft_addBot.method,
        props.credential.loginToken,
        addData
      );
      if (response.data.data) {
        setPlan(response.data.data);
        closeAddModal(false);
      }
    } catch (error) {
      if (error.response) showNotify(error.response.data.message, "", "danger");
      else if (error.request) showNotify("Request failed", "", "danger");
      else showNotify("Something went wrong", "", "danger");
    }
  };
  const deletePlan = async (data) => {
    try {
      const response = await ApiCall(
        apiConfig.nft_delBot.url,
        apiConfig.nft_delBot.method,
        props.credential.loginToken,
        data
      );
      if (response.data.data) setPlan(response.data.data);
    } catch (error) {
      if (error.response) showNotify(error.response.data.message, "", "danger");
      else if (error.request) showNotify("Request failed", "", "danger");
      else showNotify("Something went wrong", "", "danger");
    }
  };
  const sell = async (data) => {
    try {
      closeDetailModal();
      const response = await ApiCall(
        apiConfig.nft_letSell.url,
        apiConfig.nft_letSell.method,
        props.credential.loginToken,
        data
      );
      if (response.data.data) setLogData(response.data.data);
    } catch (error) {
      if (error.response) showNotify(error.response.data.message, "", "danger");
      else if (error.request) showNotify("Request failed", "", "danger");
      else showNotify("Something went wrong", "", "danger");
    }
  };
  const del = async (data) => {
    try {
      const response = await ApiCall(
        apiConfig.nft_letDel.url,
        apiConfig.nft_letDel.method,
        props.credential.loginToken,
        data
      );
      if (response.data.data) setLogData(response.data.data);
    } catch (error) {
      if (error.response) showNotify(error.response.data.message, "", "danger");
      else if (error.request) showNotify("Request failed", "", "danger");
      else showNotify("Something went wrong", "", "danger");
    }
  };

  //init
  useEffect(() => {
    //set socket
    if (props.credential.loginToken) {
      setSocket(
        io(apiConfig.endPoint, {
          auth: {
            token: props.credential.loginToken,
          },
        })
      );
    } else {
      setSocket(io(apiConfig.endPoint));
    }
    //get plan and logs
    async function readPlan() {
      try {
        const response = await ApiCall(
          apiConfig.nft_readPlan.url,
          apiConfig.nft_readPlan.method,
          props.credential.loginToken,
          {}
        );
        if (response.data.data) setPlan(response.data.data);
      } catch (error) {
        // showNotify("Failed!",'','danger');
      }
    }
    readPlan();
  }, [props.credential.loginToken]);
  //function with socket
  useEffect(() => {
    if (socket) {
      const publicKey = props.credential.loginUserName;
      socket.on("connect", () => {
        // when connection started
        console.log("connect");
        socket.on("nft:one:newPlan", (data) => {
          setPlan(data.filter((x) => x.owner === publicKey));
        });
        socket.on("nft:one:logStatus", (data) => {
          setLogData(data.filter((x) => x.owner === publicKey));
        });
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="content">
        {/* info and setting bar */}
        <Card>
          <CardHeader>
            <CardTitle tag="h4">NFT Sniper setting</CardTitle>
            <Button className="btn1" onClick={() => showAddModal()}>
              + Add sniping plan
            </Button>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead className="text-primary">
                <tr>
                  <th>NFT contract</th>
                  <th className="text-left">Trigger Type</th>
                  <th className="text-left">Flipstate Function</th>
                  <th className="text-left">Sale Status Variable</th>
                  <th className="text-left">ID range</th>
                  <th className="text-left">Mint Function</th>
                  <th className="text-left">NFT price</th>
                  <th className="text-left">minting Amount</th>
                  <th className="text-left">Delay</th>
                  <th className="text-left">Gas price</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>
                        <a
                          href={`${explorerURL}/address/${item.token}`}
                          target="_blank"
                        >
                          {item.token}
                        </a>
                      </td>
                      <td className="text-left">{item.sniperTrigger}</td>
                      <td className="text-left">
                        {item.startFunction}
                      </td>
                      <td className="text-left">
                        {item.saleStatus}
                      </td>
                      <td className="text-left">
                        {item.rangeStart} ~ {item.rangeEnd}
                      </td>
                      <td className="text-left">{item.mintFunction}</td>
                      <td className="text-left">{item.eth}</td>
                      <td className="text-left">{item.tokenAmount}</td>
                      <td className="text-left">{item.waitTime} {item.delayMethod}(s)</td>
                      <td className="text-left">{item.gasPrice} Gwei</td>
                      <td className="text-left">
                        <Button
                          className="btn-link btn-icon"
                          color="success"
                          size="sm"
                          onClick={() => showAddModal(item)}
                        >
                          <i className="tim-icons icon-bullet-list-67" />
                        </Button>
                        <Button
                          className="btn-link"
                          color="danger"
                          size="sm"
                          onClick={() => deletePlan(item)}
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
        </Card>

        {/* logs table */}
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Bot logs</CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead className="text-primary">
                <tr>
                  <th className="text-center">#</th>
                  <th>Token</th>
                  <th className="text-left">
                    Current Price({baseTokenSymbol})
                  </th>
                  <th className="text-left">Status</th>
                  <th className="text-left">StatusAt</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td className="text-center">
                        <div className="photo">
                          <img
                            alt="..."
                            src={require("assets/img/bitcoin.png").default}
                          />
                        </div>
                      </td>
                      <td>
                        <a
                          href={`${explorerURL}/token/${item.token}`}
                          target="_blank"
                        >
                          {item.token}
                        </a>
                      </td>
                      <td className="text-left">{item.currentPrice}</td>
                      <td className="text-left">{item.txStatus}</td>
                      <td className="text-left">{item.created}</td>
                      <td className="text-left">
                        {item.error && (
                          <Button
                            className="btn-link btn-icon"
                            color="success"
                            size="sm"
                            onClick={() => showErrorModal(item)}
                          >
                            <i className="tim-icons icon-notes" />
                          </Button>
                        )}
                        <Button
                          className="btn-link btn-icon"
                          color="success"
                          size="sm"
                          onClick={() => showDetailModal(item)}
                        >
                          <i className="tim-icons icon-bullet-list-67" />
                        </Button>
                        <Button
                          className="btn-link"
                          color="danger"
                          size="sm"
                          onClick={() => del(item)}
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
        </Card>
      </div>
      {/* setting modal */}
      <Modal modalClassName="modal-black mModal mm1" isOpen={modalAdd}>
        <div className="modal-header">
          <h4>NFT Sniper Setting</h4>
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
                      value={addData.token}
                      onChange={(e) =>
                        setAddData({ ...addData, token: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="pr-md-1" md="12">
                  <FormGroup>
                    <label>Sniper Trigger</label>
                    <Select
                      options={[
                        {
                          value: "flipstate",
                          label: arrSniperTrigger["flipstate"],
                        },
                        {
                          value: "statuschange",
                          label: arrSniperTrigger["statuschange"],
                        },
                        {
                          value: "idrange",
                          label: arrSniperTrigger["idrange"],
                        },
                      ]}
                      className="react-select info"
                      classNamePrefix="react-select"
                      value={{
                        value: addData.sniperTrigger,
                        label: arrSniperTrigger[addData.sniperTrigger],
                      }}
                      onChange={(e) => {
                        setAddData({ ...addData, sniperTrigger: e.value });
                      }}
                    ></Select>
                  </FormGroup>
                </Col>
                {/* flipstate function */}
                {addData.sniperTrigger == "flipstate" && (
                  <Col className="pr-md-1" md="12">
                    <FormGroup>
                      <label>
                        Flipstate function for public sale( ex: startSale(),
                        startSale(uint256, address) )
                      </label>
                      <Input
                        type="text"
                        value={addData.startFunction}
                        onChange={(e) =>
                          setAddData({
                            ...addData,
                            startFunction: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                )}

                {/* statuschange */}
                {addData.sniperTrigger == "statuschange" && (
                  <Col className="pr-md-1" md="12">
                    <FormGroup>
                      <label>
                        Name of variable for sale status( ex: saleIsStarted,
                        saleIsActive )
                      </label>
                      <Input
                        type="text"
                        value={addData.saleStatus}
                        onChange={(e) =>
                          setAddData({
                            ...addData,
                            saleStatus: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                )}
                {/* ID range */}
                {addData.sniperTrigger == "idrange" && (
                  <Col className="pr-md-1" md="12">
                    <Row>
                      <Col className="pr-md-1" md="6">
                        <FormGroup>
                          <label>Token Number (from)</label>
                          <Input
                            type="number"
                            value={addData.rangeStart}
                            onChange={(e) =>
                              setAddData({
                                ...addData,
                                rangeStart: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pr-md-1" md="6">
                        <FormGroup>
                          <label>Token Number (to)</label>
                          <Input
                            type="number"
                            value={addData.rangeEnd}
                            onChange={(e) =>
                              setAddData({
                                ...addData,
                                rangeEnd: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                )}
                {/* Mint function */}
                <Col className="pr-md-1" md="12">
                  <FormGroup>
                    <label>Mint function name( ex: mint, mintNFT )</label>
                    <Input
                      type="text"
                      value={addData.mintFunction}
                      onChange={(e) =>
                        setAddData({ ...addData, mintFunction: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="pr-md-1" md="12">
                  <Row>
                    <Col className="pr-md-1" md="12">
                      <FormGroup>
                        <label>
                          NFT amount to mint.(Check in max tax amount in
                          contract.)
                        </label>
                        <Input
                          type="number"
                          value={addData.tokenAmount}
                          onChange={(e) =>
                            setAddData({
                              ...addData,
                              tokenAmount: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-md-1" md="12">
                      <FormGroup>
                        <label>NFT token {baseTokenSymbol} price</label>
                        <Input
                          type="number"
                          value={addData.eth}
                          onChange={(e) =>
                            setAddData({ ...addData, eth: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col className="pr-md-1" md="12">
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>delay</label>
                        <Input
                          type="number"
                          value={addData.waitTime}
                          onChange={(e) =>
                            setAddData({ ...addData, waitTime: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>delay unit</label>
                        <Select
                          options={[
                            // {
                            //   value: "block",
                            //   label: "block",
                            // },
                            {
                              value: "second",
                              label: "second",
                            },
                          ]}
                          className="react-select info"
                          classNamePrefix="react-select"
                          value={{
                            value: addData.delayMethod,
                            label: addData.delayMethod,
                          }}
                          onChange={(e) => {
                            setAddData({ ...addData, delayMethod: e.value });
                          }}
                        ></Select>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col className="pr-md-1" md="12">
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>GasPrice(in gwei)</label>
                        <Input
                          type="number"
                          value={addData.gasPrice}
                          onChange={(e) =>
                            setAddData({ ...addData, gasPrice: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>GasLimit(in general &gt; 4000000)</label>
                        <Input
                          type="number"
                          value={addData.gasLimit}
                          onChange={(e) =>
                            setAddData({ ...addData, gasLimit: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col className="pr-md-1" md="12">
                  <Button color="btn1" onClick={addHandler}>
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </div>
      </Modal>
      {/* detail modal */}
      <Modal modalClassName="modal-black mModal" isOpen={detailModalStatus}>
        <div className="modal-header">
          <h4>Information</h4>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={closeDetailModal}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
        {detailData && (
          <div className="modal-body padBtt detailInfo">
            <Row>
              <Col className="pr-md-1" md="6">
                <Row>
                  <Col className="pr-md-1" md="12">
                    <FormGroup>
                      <label>Wallet</label>
                      <div className="labelOne">{detailData.public}</div>
                    </FormGroup>
                  </Col>
                  <Col className="pr-md-1" md="12">
                    <FormGroup>
                      <label>TokenName</label>
                      <div className="labelOne">{detailData.token}</div>
                    </FormGroup>
                  </Col>
                  <Col className="pr-md-1" md="12">
                    <FormGroup>
                      <label>Current Status</label>
                      <div className="labelOne">{detailData.txStatus}</div>
                    </FormGroup>
                  </Col>
                  <Col className="pr-md-1" md="12">
                    <FormGroup>
                      <label>Current Price</label>
                      <div className="labelOne">{detailData.currentPrice}</div>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col className="pr-md-1 detailBtnDiv" md="6">
                {/* // 0-buying,1-bought,2-buy failed,4-approving,5-approved,6-approve failed,7-selling,8-sold,9-sell failed */}
                <Col className="pr-md-1" md="12">
                  {(detailData.status === 1 ||
                    detailData.status === 5 ||
                    detailData.status === 9 ||
                    detailData.status === 6) && (
                    <Button
                      color="warning"
                      size="sm"
                      className="btnOne"
                      onClick={() => sell(detailData)}
                    >
                      Sell
                    </Button>
                  )}
                </Col>
                <Col className="pr-md-1" md="12">
                  <Button
                    color="warning"
                    size="sm"
                    className="btnOne"
                    onClick={() => del(detailData)}
                  >
                    Delete
                  </Button>
                </Col>
                {detailData.tTx && (
                  <Col className="pr-md-1" md="12">
                    <Button color="default" size="sm" className="btnOne">
                      <a
                        className="text-white"
                        href={`${explorerURL}/tx/${detailData.tTx}`}
                        target="_blank"
                      >
                        Token Transaction
                      </a>
                    </Button>
                  </Col>
                )}
                {detailData.bTx && (
                  <Col className="pr-md-1" md="12">
                    <Button color="default" size="sm" className="btnOne">
                      <a
                        className="text-white"
                        href={`${explorerURL}/tx/${detailData.bTx}`}
                        target="_blank"
                      >
                        Buy Transaction
                      </a>
                    </Button>
                  </Col>
                )}
                {detailData.aTx && (
                  <Col className="pr-md-1" md="12">
                    <Button color="default" size="sm" className="btnOne">
                      <a
                        className="text-white"
                        href={`${explorerURL}/tx/${detailData.aTx}`}
                        target="_blank"
                      >
                        Approve Transaction
                      </a>
                    </Button>
                  </Col>
                )}
                {detailData.sTx && (
                  <Col className="pr-md-1" md="12">
                    {(detailData.status === 7 ||
                      detailData.status === 8 ||
                      detailData.status === 9) && (
                      <Button color="default" size="sm" className="btnOne">
                        <a
                          className="text-white"
                          href={`${explorerURL}/tx/${detailData.sTx}`}
                          target="_blank"
                        >
                          Sell Transaction
                        </a>
                      </Button>
                    )}
                  </Col>
                )}
              </Col>
            </Row>
          </div>
        )}
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
export default connect(mapStateToProps)(NFTSniperBot);
