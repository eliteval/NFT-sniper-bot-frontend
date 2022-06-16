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
import { useMoralisWeb3Api } from "react-moralis";

const explorerURL = "https://etherscan.io/";
// const explorerURL = "https://testnet.bscscan.com/";

const Bots = (props) => {
  const [plans, setPlans] = useState([]);
  const [logs, setLogs] = useState([]);
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

  const Web3Api = useMoralisWeb3Api();

  const fetchNFTTrades = async () => {
    const options = {
      address: "0x30a663f66fa4689b5482bc24df164ab6891b5bdb",
      cursor: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaW1pdCI6MTAsIm9mZnNldCI6MCwib3JkZXIiOltbInRyYW5zZmVyX2luZGV4IiwiREVTQyJdXSwid2hlcmUiOnsic2VsbGVyX2FkZHJlc3MiOnt9LCJidXllcl9hZGRyZXNzIjp7fSwidG9rZW5fYWRkcmVzcyI6IjB4MzBhNjYzZjY2ZmE0Njg5YjU0ODJiYzI0ZGYxNjRhYjY4OTFiNWJkYiJ9LCJwYWdlIjoxLCJrZXkiOiIxNDk1ODUyNS4yODYiLCJ0b3RhbCI6MzY4MCwiaWF0IjoxNjU1MjAwMjU2fQ.WE1NUwQ_hVJlN-xRmDfaWDlwqLJpcLw2fm01FnrjB50",
      limit: "30",
      chain: "eth",
    };
    const NFTTrades = await Web3Api.token.getNFTTrades(options);
    console.log(NFTTrades);
  };

  const getAllTokenIds = async () => {
    const options = {
      address: "0x6c1cd3bce68653bba8ab28882d2d3d261113e3a8",
      chain: "eth",
    };
    const NFTs = await Web3Api.token.getAllTokenIds(options);
    console.log(NFTs);
  };

  useEffect(() => {
    (async () => {
      fetchNFTTrades();
      // getAllTokenIds();

      try {
        const response = await ApiCall(
          apiConfig.nft_readAllPlans.url,
          apiConfig.nft_readAllPlans.method,
          props.credential.loginToken
        );
        if (response.status === 200) {
          setPlans(response.data);
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed in getting all plans.", "danger");
      }
      try {
        const response = await ApiCall(
          apiConfig.nft_readAllLogs.url,
          apiConfig.nft_readAllLogs.method,
          props.credential.loginToken
        );
        if (response.status === 200) {
          setLogs(response.data);
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed in getting all logs.", "danger");
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
                <h3 className="title">Plans</h3>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-left">Public Key</th>
                      <th className="text-left">Contract</th>
                      <th className="text-left">Trigger</th>
                      <th className="text-left">Flipstate</th>
                      <th className="text-left">Sale Status</th>
                      <th className="text-left">ID range</th>
                      <th className="text-left">Mint Function</th>
                      <th className="text-left">Amount</th>
                      <th className="text-left">Price</th>
                      <th className="text-left">Delay</th>
                      <th className="text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">
                            <a
                              href={`${explorerURL}/address/${item.public}`}
                              target="_blank"
                            >
                              {shortenWallet(item.public)}
                            </a>
                          </td>
                          <td className="text-left">
                            <a
                              href={`${explorerURL}/address/${item.token}`}
                              target="_blank"
                            >
                              {shortenWallet(item.token)}
                            </a>
                          </td>
                          <td className="text-left">{item.sniperTrigger}</td>
                          <td className="text-left">
                            {item.startFunction} {item.funcRegex}
                          </td>
                          <td className="text-left">{item.saleStatus}</td>
                          <td className="text-left">
                            {item.rangeStart}~{item.rangeEnd}
                          </td>
                          <td className="text-left">{item.mintFunction}</td>
                          <td className="text-left">{item.tokenAmount}</td>
                          <td className="text-left">{item.eth}</td>
                          <td className="text-left">
                            {item.waitTime} {item.delayMethod}(s)
                          </td>
                          <td className="text-left">{item.created}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <hr />
                <h3 className="title">Logs</h3>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-center">#</th>
                      <th>Wallet</th>
                      <th>Contract</th>
                      <th>Trigger</th>
                      <th className="text-left">Mint function</th>
                      <th className="text-left">Minted amount</th>
                      <th className="text-left">Token Price</th>
                      <th className="text-left">Transaction</th>
                      <th className="text-left">Gas Price</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Created</th>
                      <th className="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-center">{key + 1}</td>
                          <td>
                            <a
                              href={`${explorerURL}/address/${item.public}`}
                              target="_blank"
                            >
                              {shortenWallet(item.public)}
                            </a>
                          </td>
                          <td>
                            <a
                              href={`${explorerURL}/address/${item.contract}`}
                              target="_blank"
                            >
                              {shortenWallet(item.contract)}
                            </a>
                          </td>
                          <td className="text-left">{item.trigger}</td>
                          <td className="text-left">{item.mintFunction}</td>
                          <td className="text-left">{item.tokenAmount}</td>
                          <td className="text-left">{item.tokenPrice}</td>
                          <td>
                            <a
                              href={`${explorerURL}/tx/${item.tx}`}
                              target="_blank"
                            >
                              {shortenWallet(item.tx)}
                            </a>
                          </td>
                          <td className="text-left">{item.gasPrice}</td>
                          <td className="text-left">
                            {item.status == 1 ? (
                              <span style={{ color: "green" }}>success</span>
                            ) : (
                              <span style={{ color: "red" }}>failed</span>
                            )}
                          </td>
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

export default connect(mapStateToProps)(Bots);
