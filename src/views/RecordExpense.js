import React, { useState, useEffect, useRef } from "react";
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
    const { userInfor, workspaces, currentWorkspaceIndex, setPageLoading } = useProduct();

    const [paymentDate, setPaymentDate] = useState(new Date());
    const [amountData, setAmountData] = useState("");
    const [beneficiaryData, setBeneficiaryData] = useState("");
    const [purposeData, setPurposeData] = useState("");

    const [submitResult409, setSubmitResult409] = useState(false);

    const paymentValidationStatus = useRef({
        beneficiary: true,
        payment_date: true,
        amount: true,
        purpose: true
    });

    const [payValiStatus, setPayValiStatus] = useState({
        beneficiary: true,
        payment_date: true,
        amount: true,
        purpose: true    
    })

    const customFormat = (value) => {
        return `custom format: ${value.format(dateFormat)}`
    };


    const onDateChange = (e) => {
        if (e === null) {
            setPaymentDate("");
        } else {
            let date = e._d;
            setPaymentDate(date.toISOString().split('T')[0]);
        }
    }

    const onNumberChange = (value) => {
        if (value === null) {
            setAmountData("");
        } else {
            setAmountData(value);
        }
    }

    const onBeneficiaryChange = (value) => {
        if (value === null) {
            setBeneficiaryData("");
        } else {
            setBeneficiaryData(value);
        }
    }


    const onPurchaseChange = (e) => {
        setPurposeData(e.target.value);
    }

    const onValidation = () => {
        let validation = true;

        console.log("Date: ", paymentDate);
        if (paymentDate === "") {
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
        if (amountData === "") {
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

        if (beneficiaryData === "") {
            setPayValiStatus(propState => ({
                ...propState,
                beneficiary: false
            }));
            paymentValidationStatus.current.beneficiary = false;
            validation = false;
        } else {
            setPayValiStatus(propState => ({
                ...propState,
                beneficiary: true
            }));
            paymentValidationStatus.current.beneficiary = true;
        }

        if (purposeData === "") {
            setPayValiStatus(propState => ({
                ...propState,
                purpose: false
            }));
            paymentValidationStatus.current.purpose = false;
            validation = false;
        } else {
            setPayValiStatus(propState => ({
                ...propState,
                purpose: true
            }));
            paymentValidationStatus.current.purpose = true;
        }

        return validation;
    }

    const onExpense = () => {
        if (onValidation() === true) {
            const padiAt = new Date(paymentDate);
            console.log(padiAt.toISOString());
            console.log('---------------------', beneficiaryData);
            const data = {
                "fee": {
                    "currency": "NGN",
                    "amount": amountData
                },
                "paidAt": padiAt,
                "beneficiary": beneficiaryData,
                "purpose": purposeData
            }
            console.log('expense data', data);
            let url = "";
            let config = {};
            url = '/ledger-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/expenditures';
            config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': 'Bearer ' + userInfor.accessToken
                }
            };

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
                    if (err.message === "Request failed with status code 409") {
                        setSubmitResult409(true);
                    } else {
                        props.history.push('/login');
                    }


                })
        }
    }

    return (
        <Container fluid className="record-payment-container">
            <Row className="mt-4">
                <Col lg="6" md="12" sm="12" className="mb-4">
                    <Card small className="h-100">
                        <CardBody className="d-flex flex-column">
                            <div className="record-payment-title">
                                <p className="record-payment-p1">Record Expense</p>
                            </div>
                            <div className="">
                                <Input className="col-md-12 col-lg-8 record-payment-style mb-3 mt-3" id="beneficiary" onChange={(e) => onBeneficiaryChange(e.target.value)} placeholder="Beneficiary Name" />
                                {paymentValidationStatus.current.beneficiary === false ? <p className="p-error">Input Beneficiary Name</p> : null}

                                <InputNumber className="col-md-12 col-lg-8 record-payment-style mb-3 mt-3" id="amount" min={1} onChange={onNumberChange} placeholder="Amount" />
                                {paymentValidationStatus.current.amount === false ? <p className="p-error">Input Amount</p> : null}

                                <DatePicker className="col-md-12 col-lg-8 record-payment-style mb-3 mt-3" id="date" onChange={(e) => onDateChange(e)} defaultValue={moment(new Date(), dateFormat)} format={dateFormat} />
                                {paymentValidationStatus.current.payment_date === false ? <p className="p-error">Input Date</p> : null}

                                <div className="col-md-12 col-lg-8 record-payment-textarea mt-3 mb-3">
                                    <TextArea className="record-payment-style " rows={3} placeholder="Purpose" id="purpose" onChange={onPurchaseChange} value={purposeData} />
                                    {paymentValidationStatus.current.purpose === false ? <p className="p-error">Input Purpose</p> : null}
                                </div>

                                <br />
                                {submitResult409 === true ? <p className="p-error">payment reference already used</p> : null}
                                <Button type="primary" className="col-md-12 col-lg-6 record-payment-style record-payment-btn" onClick={onExpense}>Submit Expense</Button>
                            </div>

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default RecordPayment;