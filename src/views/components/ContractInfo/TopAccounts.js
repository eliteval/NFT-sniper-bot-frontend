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
import ImageItem from "views/components/ContractInfo/ImageItem";
import altimage from "assets/img/alt.png";
const explorerURL = "https://etherscan.io/";

const TopAccounts = (props) => {
  let { address, defaultImage } = props;
  const [data, setData] = useState([]);
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
          apiConfig.getTopAccounts.url,
          apiConfig.getTopAccounts.method,
          props.credential.loginToken,
          payLoad
        );
        if (response.status === 200) {
          setData(response.data.data);

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
            <Table responsive>
              <thead className="text-primary">
                <tr>
                  <th className="text-left"></th>
                  <th className="text-left">Address</th>
                  <th className="text-left">Hodling Value</th>
                  <th className="text-left">NFT Counts</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td className="text-left">{key + 1}</td>    
                      <td className="text-left">
                        {shortenWallet(item.accountAddress)}
                        <a
                          href={`${explorerURL}/address/${item.accountAddress}`}
                          target={"_blank"}
                        >
                          &nbsp; <i className="tim-icons icon-link-72" />
                        </a>
                      </td>                    
                      <td className="text-left">{item.holdingValue} ETH</td>
                      <td className="text-left">{item.nftCount}</td>                  
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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

export default connect(mapStateToProps)(TopAccounts);
