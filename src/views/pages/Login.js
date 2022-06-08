import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import "./login.css";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  FormGroup,
  Label,
} from "reactstrap";

const Login = ({ credential, LoginSuccess, LogOutSuccess }) => {
  const [state, setState] = React.useState({ public: "", password: "" });
  const history = useHistory();
  const { apiConfig, ApiCall } = global;
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
  const submit = async () => {
    if (!state.public) {
      notify("Please input public key", "danger");
      return;
    }
    if (!state.password) {
      notify("Please input password", "danger");
      return;
    }
    try {
      const payLoad = {
        public: state.public,
        password: state.password,
      };
      const response = await ApiCall(
        apiConfig.authenticate.url,
        apiConfig.authenticate.method,
        "",
        payLoad
      );
      LoginSuccess(response.data);
    } catch (error) {
      if (error.response) {
        notify(error.response.data.message, "danger");
      } else if (error.request) {
        // client never received a response, or request never left
        notify("Request failed", "", "danger");
        // console.log(error.request)
      } else {
        notify("Something went wrong", "", "danger");
      }
      LogOutSuccess();
    }
  };
  React.useEffect(() => {
    document.body.classList.toggle("login-page");
    return function cleanup() {
      document.body.classList.toggle("login-page");
    };
  });
  useEffect(() => {
    if (credential && credential.loginToken) {
      history.push("/");
    }
  }, [credential]);


  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className="content">
        <Container>
          <Col className="ml-auto mr-auto" lg="4" md="6">
            <Form className="form">
              <Card
                className="card-login card-white"
                style={{ backgroundColor: "#131313" }}
              >
                <CardHeader style={{ paddingBottom: "10px" }}>
                  <img
                    alt="..."
                    src={require("assets/img/card-nft.png").default}
                    style={{ padding: "25px 25%" }}
                  />
                  <CardTitle
                    style={{
                      color: "white",
                      padding: "10px",
                      fontSize: "20px",
                      marginTop: "175px",
                      paddingTop: "0px",
                      textAlign: "center",
                    }}
                  >
                    nft tools
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <InputGroup
                    className={classnames({
                      "input-group-focus": state.emailFocus,
                    })}
                    style={{ border: "pink 1px solid" }}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="tim-icons icon-wallet-43" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="public key"
                      type="text"
                      onFocus={(e) => setState({ ...state, emailFocus: true })}
                      onBlur={(e) => setState({ ...state, emailFocus: false })}
                      value={state.public}
                      onChange={(e) =>
                        setState({ ...state, public: e.target.value })
                      }
                    />
                  </InputGroup>
                  <InputGroup
                    className={classnames({
                      "input-group-focus": state.emailFocus,
                    })}
                    style={{ border: "pink 1px solid" }}
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="tim-icons icon-key-25" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="password"
                      type="password"
                      onFocus={(e) => setState({ ...state, emailFocus: true })}
                      onBlur={(e) => setState({ ...state, emailFocus: false })}
                      value={state.password}
                      onChange={(e) =>
                        setState({ ...state, password: e.target.value })
                      }
                    />
                  </InputGroup>                
                </CardBody>
                <CardFooter>
                  <a
                    href="/auth/register"
                    className="registerA"
                    style={{ color: "white" }}
                  >
                    Go to register
                  </a>
                  <Button
                    block
                    className="mb-3"
                    onClick={submit}
                    size="lg"
                    style={{
                      backgroundColor: "white",
                      backgroundImage: "none",
                      color: "black",
                    }}
                  >
                    Login
                  </Button>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Container>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { credential: LoginReducer };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      LogOutSuccess: global.Actions.LoginAction.LogOutSuccess,
      LoginSuccess: global.Actions.LoginAction.LoginSuccess,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
