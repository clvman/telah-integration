import React, {useState, useEffect, useRef} from "react";
import { Container, Row, Col, Modal } from "shards-react";
import { Select, Input, DatePicker, InputNumber } from 'antd';
import 'antd/dist/antd.css';
import { Card, CardBody, Button } from "shards-react";
import { useProduct } from '../context/proudctContext';
import axios from 'axios';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

function RecordPayment(props) {
  const {userInfor, workspaces, currentWorkspaceIndex, setPageLoading} = useProduct();
  const [typeData, setTypeData] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [amountData, setAmountData] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState([]);
  const [payValiStatus, setPayValiStatus] = useState({
    payment_type: true,
    project_type: true,
    payment_date: true,
    amount: true,
    reference: true,
    description: true    
  })
  const [submitResult409, setSubmitResult409] = useState(false);
  const [projectTypeData, setProjectTypeData] = useState("");

  const paymentValidationStatus = useRef({
    payment_type: true,
    project_type: true,
    payment_date: true,
    amount: true,
    reference: true,
    description: true
  });


  useEffect(() => {
    if(workspaces.length > 0){
      setPageLoading({
        loginStatus: true,
        loginText: 'Loading...'      
      });  
      let url = '/contribution-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/projects';
      console.log('url', url);
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': 'Bearer ' + userInfor.accessToken
        }
      }  
      axios.get(url, config)
        .then(res => {
          setPageLoading({
            loginStatus: false,
            loginText: 'Loading...'      
          });  
          setProjectType(res.data.results);
          console.log('Record Payment', res.data.results);
        })
        .catch(err => {
          console.log('Record Payment error', err);
          setPageLoading({
            loginStatus: false,
            loginText: 'Loading...'      
          });  
          props.history.push('/login');
        })
    }

  }, []);

  
  const paymentTypeChange = (e) => {
    setTypeData(e);
  }

  const projectTypeChange = (e) => {
    setProjectTypeData(e);
  }

  const customFormat = (value) => {
    return `custom format: ${value.format(dateFormat)}`
  };


  const onDateChange = (e) => {
    if(e === null) {
      setPaymentDate("");
    } else {
      let date = e._d;
      setPaymentDate(date.toISOString().split('T')[0]);
    }
  }   
  
  const onNumberChange = (value) => {
    if(value === null) {
      setAmountData("");
    } else {
      setAmountData(value);
    }
  }

  const onReferenceChange = (e) => {
    setReference(e.target.value);
  }

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const onValidation = () => {
    let validation = true;
    console.log("Payment Type: ", typeData);
    if(typeData === "") {
      paymentValidationStatus.current.payment_type = false; 
      setPayValiStatus(propState => ({
        ...propState,
        payment_type: false
      }));
      validation = false;
    } else {
      setPayValiStatus(propState => ({
        ...propState,
        payment_type: true
      }));
      paymentValidationStatus.current.payment_type = true; 
    }
    console.log("Project Type: ", projectTypeData);
    if(projectTypeData === "" && typeData === "Project") {
      paymentValidationStatus.current.project_type = false; 
      setPayValiStatus(propState => ({
        ...propState,
        project_type: false
      }));
      validation = false;
    } else {
      setPayValiStatus(propState => ({
        ...propState,
        project_type: true
      }));
      paymentValidationStatus.current.project_type = true; 
    }
    console.log("Date: ", paymentDate);
    if(paymentDate === "") {
      paymentValidationStatus.current.payment_date = false; 
      setPayValiStatus(propState => ({
        ...propState,
        payment_date: false
      }));
      validation = false;
    } else {
      setPayValiStatus(propState => ({
        ...propState,
        payment_date: true
      }));
      paymentValidationStatus.current.payment_date = true; 
    }
    console.log("Amount: ", amountData);
    if(amountData === "") {
      setPayValiStatus(propState => ({
        ...propState,
        amount: false
      }));
      paymentValidationStatus.current.amount = false; 
      validation = false;
    } else {
      setPayValiStatus(propState => ({
        ...propState,
        amount: true
      }));
      paymentValidationStatus.current.amount = true; 
    }

    // Object.keys(paymentValidationStatus.current).map((item, index) => {
    //   if(paymentValidationStatus.current[item] === false) {
    //     validation = false;
    //   }
    // })
    console.log(paymentValidationStatus.current);
    return validation;
  }

  const onPrimary = () => {
    if(onValidation() === true) {
      console.log('--------------------- ', typeData);
      const padiAt = new Date(paymentDate);
      console.log(padiAt.toISOString());
      const data= {
        "payerName": userInfor.displayName,
        "paymentReference": reference,
        "comment": description,
        "paidAt": padiAt,
        "fee": {
            "currency": "NGN",
            "amount": amountData
        }
      }
      let url = "";
      let config = {};
      console.log(typeData);
      if(typeData === "Project") {
        url = '/ledger-api/projects/' + projectTypeData + '/offline-payments';
        config = {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Authorization': 'Bearer ' + userInfor.accessToken
          },
          params: {
            'tenureId': props.match.params.id
          }
        } ;
      } else {
        url = '/ledger-api/tenures/' + props.match.params.id + '/amenity-ledger/offline-payments';
        config = {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Authorization': 'Bearer ' + userInfor.accessToken
          }
        } ;
      }
      setPageLoading({
        loginStatus: true,
        loginText: 'Loading...'      
      }); 
      axios.post(url, JSON.stringify(data), config)
        .then(res => {
          console.log('payment', res);
          setPageLoading({
            loginStatus: false,
            loginText: 'Loading...'      
          }); 
          alert("Success");
          props.history.push('/dashboard');
        })
        .catch(err => {
          setPageLoading({
            loginStatus: false,
            loginText: 'Loading...'      
          }); 
          console.log('payment error: ', err.message);
          if(err.message === "Request failed with status code 409") {
            setSubmitResult409(true);
          } else {
            props.history.push('/login');
          }

          
        })
    }


  }

  return(
    <Container fluid className="record-payment-container">
      <Row className="mt-4">
        <Col lg="6" md="12" sm="12" className="mb-4">
          <Card small className="h-100">
            <CardBody className="d-flex flex-column">
              <div className="record-payment-title">
                <p className="record-payment-p1">Record Payments</p>
                <p className="record-payment-p2">({props.match.params.name})</p>
              </div>
              <div className="">
                <Select className="col-md-12 col-lg-8 pl-0 pr-0 mt-3 mb-3 record-payment-select" defaultValue="Payment Type" onChange={paymentTypeChange}>
                  <Option value="Service Charge">Service Charge</Option>
                  <Option value="Project">Project</Option>
                </Select>
                {paymentValidationStatus.current.payment_type === false ? <p className="p-error">Select Payment Type</p> : null}
                {typeData === "Project" ? (
                  <Select className="col-md-12 col-lg-8 pl-0 pr-0 mt-3 mb-3 record-payment-select" defaultValue="Project Type" onChange={projectTypeChange}>
                    {projectType.length > 0 ? projectType.map((item, index) => (
                      <Option key={index} value={item.id}>{item.name}</Option>
                    )) : null}
                  </Select>
                ) : (
                  <Select className="col-md-12 col-lg-8 pl-0 pr-0 mt-3 mb-3 record-payment-select" defaultValue="Project Type" onChange={projectTypeChange} disabled>
                    {projectType.length > 0 ? projectType.map((item, index) => (
                      <Option key={index} value={item.id}>{item.name}</Option>
                    )) : null}
                  </Select>
                )}

                {paymentValidationStatus.current.project_type === false ? <p className="p-error">Select Project Type</p> : null}
                <DatePicker className="col-md-12 col-lg-8 record-payment-style mb-3 mt-3" id="date" onChange={(e) => onDateChange(e)}  defaultValue={moment(new Date(), dateFormat)} format={dateFormat} />
                {paymentValidationStatus.current.payment_date === false ? <p className="p-error">Input Payment Date</p> : null}
                
                <InputNumber className="col-md-12 col-lg-8 record-payment-style mb-3 mt-3" id="amount" min={1} onChange={onNumberChange} placeholder="Amount" />
                {paymentValidationStatus.current.amount === false ? <p className="p-error">Input Amount</p> : null}
                <Input className="col-md-12 col-lg-8 record-payment-style mb-3 mt-3" id="reference" onChange={onReferenceChange} value={reference} placeholder="Reference" />

                <div className="col-md-12 col-lg-8 record-payment-textarea mt-3 mb-3">
                  <TextArea className="record-payment-style " rows={3} placeholder="Payment Description" id="description" onChange={onDescriptionChange} value={description} />
                </div>
                
                <br />
                {submitResult409 === true ? <p className="p-error">ayment reference already used</p> : null}
                <Button type="primary" className="col-md-12 col-lg-6 record-payment-style record-payment-btn" onClick={onPrimary}>Submit Payment</Button>
              </div>

            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default RecordPayment;