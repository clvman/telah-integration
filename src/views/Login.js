import React, { useState, useRef } from "react";
import { Row, Col } from "shards-react";
import baseAxios from '../axios/axios';
import { useProduct } from '../context/proudctContext';
import Loading from '../components/common/Loading';
import axios from 'axios';

function Login(props) {
  const [state , setState] = useState({
      email : "",
      password : "",
      successMessage: null,
      errors: {
        email: "",
        password: "",
      },
      loginState: ""
  })

  const { setUserInfor, setWorkspaces, setPageLoading } = useProduct();

  const [ loginPassword, setLoginPassword ] = useState("");
  const [ loginEmail, setLoginEmail ] = useState("");
  const [ loginPasswordError, setLoginPasswordError ] = useState("");
  const [ loginEmailError, setLoginEmailError ] = useState("");
  const [ loginError, setLoginError ] = useState("");
  const [ loginState, setLoginState ] = useState(false);
  const loginValidation = useRef(false);

  const handleChange = (event) => {
    if(event.target.id === "email") {
      setLoginEmail(event.target.value);
    } else {
      setLoginPassword(event.target.value);
    }
      // const {id , value} = event.target   
      // setState(prevState => ({
      //     ...prevState,
      //     [id] : value
      // }));
  }

  const emailValidation = () => {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(loginEmail === "" || regex.test(loginEmail) === false){
        return false;
    }
    return true;
  }

  const onValidation = () => {
    setLoginEmailError("");
    setLoginPasswordError("");
    loginValidation.current = false;
    if(loginPassword === "") {
      loginValidation.current = true;
      setLoginPasswordError("Input your correct Password");
    }

    if(emailValidation() === false) {
      loginValidation.current = true;
      setLoginEmailError("Input your correct email");
    }
  }

  const onLoginSubmit = (e) => {
    onValidation();
    if(loginValidation.current === true) return;
    setLoginState(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    }

    const data = {
      "identifier": loginEmail, 
      "password": loginPassword
    }

    axios.post('/login', JSON.stringify(data), config)
      .then(res => {
        setUserInfor(res.data);
        let workspacesArray = [];
        res.data.user.workspaces.map((item) => {
          workspacesArray.push({
            workspaceName: item.name,
            workspaceId: item.workspaceId
          })
        })
        setLoginState(false);
        setWorkspaces(workspacesArray);
        // setPageLoading(true);
        props.history.push('/dashboard');
      })
      .catch(err => {
        console.log(err)
        setLoginError("Input your correct email and password.");
        setLoginState(false);
      });
  }

  return(
    <div className="login-container">
      {loginState === true ? <Loading text="Loading..." /> : null}
      <Row className="login-row">
        <Col lg="7" md="7" sm="12" className="login-img">
          <div className="d-flex justify-content-center align-items-center offset-md-1 col-md-7 login-sub-img ">
            <div className="flex-column">
              <img className="login-chief" src={require("../images/chief.png")} alt="login-img" />
              <div className="login-text-title">Managing your Estate just got easier</div>
              <div className="login-text-content">Record payments and expenses, track down debtors and download your financial report using TELAH</div>            
            </div>
          </div>
        </Col>
        <Col lg="5" md="5" sm="12" className="login-field d-flex align-items-center">
          <div className="d-flex flex-column" >
            <img
              className="login-logo"
              src={require("../images/logo2.png")}
              alt="Shards Dashboard"
            />
            <p className="login-p">Join our community of facility managers as we help you manage your property units with ease</p>
            <input type="email" className="login-input" id="email" value={loginEmail} onChange={handleChange} placeholder="EMAIL" />
            {loginEmailError.length > 0 ? <p className="p-error">{loginEmailError}</p> : null}
            <input type="password" className="login-input" id="password" value={loginPassword} onChange={handleChange} placeholder="PASSWORD" />
            {loginPasswordError.length > 0 ? <p className="p-error">{loginPasswordError}</p> : null}
            {loginError.length > 0 ? <div><p className="p-error">{loginError}</p></div> : null}
            <div className="d-flex justify-content-end">
              <button className="btn login-btn" onClick={onLoginSubmit}>LOGIN<i className="material-icons login-icon">login</i></button>
            </div>
          </div>
        </Col>
      </Row>
      <p className="login-app-p"> TELAH APP 1.0 SECURED SPACE.</p>
    </div>
  )
}


export default Login;
