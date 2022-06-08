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

const Register = () => {
  const [state, setState] = React.useState({
    private: "",
    password: "",
    passwordConfirm: "",
  });
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
    if (!state.private) {
      notify("Please input private key", "danger");
      return;
    } else if (!state.password) {
      notify("Please input password", "danger");
      return;
    } else if (state.password.length < 6) {
      notify("Password must be at least 6 characters long", "danger");
      return;
    } else if (state.password.length > 50) {
      notify("Password must be at most 50 characters long", "danger");
      return;
    } else if (!state.passwordConfirm) {
      notify("Please check password confirm", "danger");
      return;
    } else if (state.password !== state.passwordConfirm) {
      notify("Password Confirm does not match.", "danger");
      return;
    }
    if (!checkTerms) {
      notify("Please check the agreement", "danger");
      return;
    }
    const payLoad = {
      private: state.private,
      password: state.password,
      bcrypt: state.private,
      passwordConfirm: state.passwordConfirm,
    };
    try {
      const response = await ApiCall(
        apiConfig.register.url,
        apiConfig.register.method,
        "",
        payLoad
      );
      notify(response.data.message, "success");
      window.location.href = "/auth/login";
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
    }
  };
  React.useEffect(() => {
    document.body.classList.toggle("login-page");
    return function cleanup() {
      document.body.classList.toggle("login-page");
    };
  });
  const [terms, setTerms] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [checkTerms, setCheckTerms] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await ApiCall(
          apiConfig.read_setting.url,
          apiConfig.read_setting.method,
          ""
        );
        if (response.status === 200) {
          response.data.data.map((item, key) => {
            if (item.key == "terms") {
              setTerms(item.value);
            }
            if (item.key == "privacy") {
              setPrivacy(item.value);
            }
          });
        } else {
          notify(response.data.message, "danger");
        }
      } catch (error) {
        notify("Failed.", "danger");
      }
    })();
  }, []);
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
                        <i className="tim-icons icon-key-25" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="private key"
                      type="password"
                      onFocus={(e) => setState({ ...state, emailFocus: true })}
                      onBlur={(e) => setState({ ...state, emailFocus: false })}
                      value={state.private}
                      onChange={(e) =>
                        setState({ ...state, private: e.target.value })
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
                      placeholder="Confirm password"
                      type="password"
                      onFocus={(e) => setState({ ...state, emailFocus: true })}
                      onBlur={(e) => setState({ ...state, emailFocus: false })}
                      value={state.passwordConfirm}
                      onChange={(e) =>
                        setState({ ...state, passwordConfirm: e.target.value })
                      }
                    />
                  </InputGroup>
                  <FormGroup check className="mt-3">
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={checkTerms}
                        onChange={(e) => setCheckTerms(e.target.checked)}
                      />
                      <span
                        className="form-check-sign"
                        style={{ color: "lightgray" }}
                      >
                        By registering, you agree to our
                        <a href={terms} target="_blank">
                          &nbsp;terms of service&nbsp;
                        </a>
                        and
                        <a href={privacy} target="_blank">
                          &nbsp;privacy policy&nbsp;
                        </a>
                      </span>
                    </Label>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <a
                    href="/auth/login"
                    className="registerA"
                    style={{ color: "white" }}
                  >
                    Go to login
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
                    Register
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
export default Register;
