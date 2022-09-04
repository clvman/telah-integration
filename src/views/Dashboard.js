import React, { useState, useEffect, useRef, useMemo } from "react";
import { Container, Row, Col } from "shards-react";
import { Table, Select, Spin, Modal } from 'antd';
import debounce from 'lodash/debounce';
import 'antd/dist/antd.css';
import { Card, CardBody } from "shards-react";
import { useProduct } from '../context/proudctContext';
import axios from 'axios';
import Loading from '../components/common/Loading';

var date = new Date();
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var year = date.getFullYear();
var month = months[date.getMonth()];
var title = "Dashboard - " + month + ' ' + year;

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      showSearch
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      placeholder="Select Residence"
      notFoundContent={
        fetching ? (
          <div>
            <Spin size="small" />
              Loading...
          </div>
        ) : (
          "Not find Data"
        )
      }
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

function Dashboard(props) {
  const columnsSeviceCharge = [
    {
      title: 'SN',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Resident Name',
      dataIndex: 'resident_name',
      key: 'resident_name',
    },
    {
      title: 'Unit Address',
      dataIndex: 'unit_address',
      key: 'unit_address',
    },
    {
      title: 'Payment Type',
      dataIndex: 'payment_type',
      key: 'payment_type',
    },
    {
      title: 'Payment Mode',
      dataIndex: 'payment_mode',
      key: 'payment_mode',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const columnsRecentExpense = [
    {
      title: 'SN',
      dataIndex: 'sn',
      key: 'sn',
      width: '5%'
    },
    {
      title: 'Beneficiary',
      dataIndex: 'beneficiary',
      key: 'beneficiary',
      width: '20%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%'
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '15%'
    },
  ];

  const [loadingState, setLoadingState] = useState(false);
  const [payHistory, setPayHistory] = useState({
    "outstanding_AMENITY": 0,
    "outstanding_PROJECT": 0,
    "paymentsInMonth_AMENITY": 0,
    "paymentsInMonth_PROJECT": 0
  });
  const [serviceChargeTransactiion, setServiceChargeTransaction] = useState([]);
  const [expressesData, setExpenses] = useState([]);
  const [pStatus, setPStatus] = useState(true);
  const { userInfor, workspaces, currentWorkspaceIndex, pageLoading, setPageLoading, workspaceChange, setWorkspaceChange } = useProduct();
  const [value, setValue] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (workspaceChange === true) {
      setPageLoading({
        loginStatus: true,
        loginText: 'Workspace Change...'
      });
      setWorkspaceChange(false);
    } else {
      setPageLoading({
        loginStatus: true,
        loginText: 'Loading...'
      });
    }

    if (Object.keys(userInfor).length === 0) {
      props.history.push('/login');
    }

    let chargeState = false;
    let serviceChargeTransactionState = false;
    let expenseState = false;

    // setLoadingState(true);
    if (workspaces.length > 0) {
      // payment history
      let url = '/ledger-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/ledger-summary';
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': 'Bearer ' + userInfor.accessToken
        }
      }

      axios.get(url, config)
        .then(res => {
          let payHistoryObject = payHistory;
          Object.keys(res.data).map((item, index) => {
            let subArray = res.data[item];
            subArray.map((subItem, subIndex) => {
              let key = item + '_' + subItem.ledgerType;
              payHistoryObject[key] = subItem.totalAmount.toLocaleString();
            })
          });
          setPayHistory(payHistoryObject);

          chargeState = true;
          if (serviceChargeTransactionState === true && expenseState === true) {
            // setLoadingState(false);
            setPageLoading({
              loginStatus: false,
              loginText: 'Loading...'
            });
          }
        })
        .catch(err => {
          console.log('payment history', err);
          props.history.push('/login');
        })

      // SERVICE CHARGE TRANSACTION
      url = '/ledger-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/ledger-transactions';
      config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': 'Bearer ' + userInfor.accessToken
        },
        params: {
          'type': 'PAYMENT',
          'type': 'OFFLINE_PAYMENT',
          'status': 'SUCCESSFUL',
          'ledgerType': 'AMENITY',
          'offset': 0,
          'limit': 5
        }
      }

      axios.get(url, config)
        .then(res => {
          let serviceData = [];

          res.data.results.map((item, index) => {
            let create_at = new Date(item.createdAt);
            let payment_type_str = "Service Charge";
            if (item.ledgerType === "PROJECT") {
              payment_type_str = "Project";
            }

            serviceData.push({
              key: index,
              sn: index + 1,
              amount: 'N' + item.amount.toLocaleString(),
              // resident_name: item.creatorName,
              resident_name: item.tenure.primaryResidents[0].displayName,
              unit_address: item.tenure.propertyUnit.houseNumber + ' ' + item.tenure.propertyUnit.streetName,
              payment_type: payment_type_str,
              payment_mode: item.type,
              date: create_at.toISOString().split('T')[0]
            })
          })
          setServiceChargeTransaction(serviceData);
          serviceChargeTransactionState = true;
          if (chargeState === true && expenseState === true) {
            // setLoadingState(false);
            setPageLoading(false);
          }
        })
        .catch(err => {
          console.log('SERVICE CHARGE TRANSACTION', err);
          props.history.push('/login');
        })

      // Expense
      url = ' /ledger-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/expenditures';
      config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': 'Bearer ' + userInfor.accessToken
        },
        params: {
          'offset': 0,
          'limit': 5,
        }
      }
      axios.get(url, config)
        .then(res => {
          let expensesData = [];

          res.data.results.map((item, index) => {
            let create_at = new Date(item.createdAt);
            expensesData.push({
              key: index,
              sn: index + 1,
              beneficiary: item.beneficiary,
              amount: 'N' + item.amount.toLocaleString(),
              purpose: item.purpose,
              date: create_at.toISOString().split('T')[0]
            })
          })

          setExpenses(expensesData);
          expenseState = true;
          if (chargeState === true && serviceChargeTransactionState === true) {
            // setLoadingState(false);
            setPageLoading(false);
          }

        })
        .catch(err => {
          console.log('Property Unit', err);
          props.history.push('/login');
        })

    }


  }, []);

  async function fetchUserList(searchtext) {
    let url = '/property-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/tenures';
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + userInfor.accessToken
      },
      params: {
        'query': searchtext
      }
    }

    return axios.get(url, config)
      .then(res =>
        res.data.results.map((item, index) => ({
          label: item.primaryResidents[0].displayName + " - " + item.propertyUnit.houseNumber + " " + item.propertyUnit.streetName,
          value: item.id
        }))
      )

  }


  const onExpense = () => {
    props.history.push('/record-expense');
  }

  const onPayment = () => {
    if (value.length === 0) {
      setPStatus(false);
      return;
    } else {
      setPStatus(true);
      props.history.push('/record-payment/' + value.key + '/' + value.label);
    }

  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Container fluid className="main-content-container">
      {loadingState === true ? <Loading /> : null}
      <Row className="page-header py-4">
        <Col lg='6' md='12' sm='12'>
          <p className="content-title">{title}</p>
        </Col>
        <Col lg='6' md='12' sm='12' className="pt-2">
          <div className="d-flex justify-content-end align-items-center right-button-wrapper">
            <div>
              <button className="btn record-btn" onClick={(e) => showModal()}>Record Payment</button>
              <button className="btn record-btn" onClick={(e) => onExpense()}>Record Expense</button>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="6" md="12" sm="12" className="mb-4">
          <Card small className="h-100">
            <CardBody className="d-flex flex-column">
              <p className="payment-p">Service Charge Payments</p>
              <Row>
                <Col lg="6" md="6" sm="6">
                  <div className="payment-price-green">N{payHistory.paymentsInMonth_AMENITY}</div>
                  <div className="serice-charge-payment-total"><i className="material-icons icon-green">arrow_upward</i>Total Paid This month</div>
                </Col>
                <Col lg="6" md="6" sm="6">
                  <div className="payment-price-red">N{payHistory.outstanding_AMENITY}</div>
                  <div className="serice-charge-payment-total"><i className="material-icons icon-red">arrow_downward</i>Total Outstanding</div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6" md="12" sm="12" className="mb-4">
          <Card small className="h-100">
            <CardBody className="d-flex flex-column">
              <p className="payment-p">Projects Payments</p>
              <Row>
                <Col lg="6" md="6" sm="6">
                  <div className="payment-price-green">N{payHistory.paymentsInMonth_PROJECT}</div>
                  <div className="serice-charge-payment-total"><i className="material-icons icon-green">arrow_upward</i>Total Paid This month</div>
                </Col>
                <Col lg="6" md="6" sm="6">
                  <div className="payment-price-red">N{payHistory.outstanding_PROJECT}</div>
                  <div className="serice-charge-payment-total"><i className="material-icons icon-red">arrow_downward</i>Total Outstanding</div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row noGutters className="page-header pt-4">
        <p className="subcontent-title">RECENT SERVICE CHARGE & PROJECT TRANSACTION</p>
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-0 pb-3">
              <div className="table-wrapper">
                <Table
                  dataSource={serviceChargeTransactiion}
                  columns={columnsSeviceCharge}
                  pagination={false}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row noGutters className="page-header pt-4">
        <p className="subcontent-title">RECENT EXPENSE TRANSACTION</p>
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-0 pb-3">
              <div className="table-wrapper">
                <Table
                  dataSource={expressesData}
                  columns={columnsRecentExpense}
                  pagination={false} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Record Payment"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <DebounceSelect
          value={value}
          placeholder="Select Residence"
          fetchOptions={fetchUserList}
          onChange={(newValue) => {
            setValue(newValue);
            setPStatus(true);
          }}
          style={{
            width: "100%"
          }}
        />
        {pStatus === false ? <p className="p-error">Select Resident</p> : null}
        <button className="btn modal-pro-btn" onClick={(e) => onPayment()}>Proceed</button>
      </Modal>


    </Container>
  )
}

export default Dashboard;
