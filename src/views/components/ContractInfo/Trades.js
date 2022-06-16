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
import Chart from "react-apexcharts";
const explorerURL = "https://etherscan.io/";

const Trades = (props) => {
  let { address } = props;
  const [data, setData] = useState([]);
  const [series, setSeries] = useState([]);
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

  const options = {
    chart: {
      height: 350,
      type: "scatter",
      zoom: {
        type: "xy",
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          color: "white",
        },
      },
    },
    yaxis: {
      // max: 70,
    },
    title: {
      // text: "Trades",
      align: "center",
      style: {
        fontSize: "25px",
        fontWeight: "bold",
        color: "white",
      },
    },
    markers: {
      size: 3,
      colors: ["#9e6fff"],
      strokeWidth: 0,
      onClick: function (e) {
        console.log(e);
      },
    },
    tooltip: {
      // enabled:false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="arrow_box" style="color:black">' +
          `${data[dataPointIndex].tradeAt}<br/> Traded At ${data[dataPointIndex].price} ETH<br/>Token ID: ${data[dataPointIndex].tokenID}` +
          "</span>" +
          "</div>"
        );
      },
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const payLoad = {
          address: address,
        };
        const response = await ApiCall(
          apiConfig.getTrades.url,
          apiConfig.getTrades.method,
          props.credential.loginToken,
          payLoad
        );
        if (response.status === 200) {
          setData((ele) => {
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
    // const series = [
    //   {
    //     name: "SAMPLE A",
    //     data: [
    //       ["2022-06-15 02:26:35.000Z", 5.4],
    //       ["2022-06-15 03:26:35.000Z", 2],
    //       ["2022-06-15 04:26:35.000Z", 3],
    //     ],
    //   },
    // ];
    var chartdata = [];
    data.map((item, key) => {
      chartdata.push([item.tradeAt, item.price]);
    });
    setSeries([
      {
        name: "Trades",
        data: chartdata,
      },
    ]);
  }, [data]);

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
            <h5 className="text-center"> {data.length} Trades in 7d</h5>
            <Chart
              options={options}
              series={series}
              type="scatter"
              height={400}
            />
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};

export default connect(mapStateToProps)(Trades);
