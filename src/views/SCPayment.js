import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "shards-react";
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { Card, CardBody } from "shards-react";
import ExportTo from '../components/export/ExportTo';
import { useProduct } from '../context/proudctContext';
import axios from 'axios';
import Loading from '../components/common/Loading';

function SCPayment(props) {
  const dataSource = [
    {
      key: 0,
      sn: 1,
      amount: 'N19,849.00',
      resident_name: 'Olaleye Afolabi',
      unit_address: '32 Franklin Stret - 1',
      payment_type: 'Service Charge',
      payment_mode: 'In App Payment',
      date: '10-12-2022'
    },
    {
      key: 1,
      sn: 2,
      amount: 'N19,849.00',
      resident_name: 'Ochai Samuel',
      unit_address: '15 Main Steet',
      payment_type: 'Project',
      payment_mode: 'Off App Payment',
      date: '10-12-2022'
    },
    {
      key: 2,
      sn: 3,
      amount: 'N19,849.00',
      resident_name: 'Ochai Samuel',
      unit_address: 'Whispering pines - 07',
      payment_type: 'Service Charge',
      payment_mode: 'Off App Payment',
      date: '10-12-2022'
    },
    {
      key: 3,
      sn: 4,
      amount: 'N19,849.00',
      resident_name: 'Ebimowei Okpongu',
      unit_address: '32 Franklin Stret - 1',
      payment_type: 'Service Charge',
      payment_mode: 'Off App Payment',
      date: '10-12-2022'
    },
    {
      key: 4,
      sn: 5,
      amount: 'N19,849.00',
      resident_name: 'John Doe',
      unit_address: '32 Franklin Stret - 1',
      payment_type: 'Service Charge',
      payment_mode: 'Off App Payment',
      date: '10-12-2022'
    },
    {
      key: 5,
      sn: 6,
      amount: 'N19,849.00',
      resident_name: 'Ebimowei Okpongu',
      unit_address: '32 Franklin Stret - 1',
      payment_type: 'Service Charge',
      payment_mode: 'Off App Payment',
      date: '10-12-2022'
    },
    {
      key: 6,
      sn: 7,
      amount: 'N19,849.00',
      resident_name: 'Ochai Samuel',
      unit_address: '32 Franklin Stret - 1',
      payment_type: 'Service Charge',
      payment_mode: 'Off App Payment',
      date: '10-12-2022'
    },
  ]

  const columns = [
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

  const text = '1-5 of ' + dataSource.length;
  const [tableData, setTableData] = useState({
    currentPage: 1,
    perPageNum: 5,
    searchText: '',
    text: text,
    data: dataSource.slice(0, 5)
  })

  const totalRow = useRef(0);
  const [loadingState, setLoadingState] = useState(false);
  const [tableLoadingState, setTableLoadingState] = useState(false);
  const [serviceCharge, setServiceCharge] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [paginationText, setPaginationText] = useState("1 - 5 of 0");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { userInfor, workspaces, currentWorkspaceIndex, setPageLoading } = useProduct();

  useEffect(() => {
    // setPageLoading({
    //   loginStatus: true,
    //   loginText: 'Loading...'      
    // });
    if (Object.keys(userInfor).length === 0) {
      props.history.push('/login');
    }

    getData(0, 5, '', '', 0);
  }, []);

  const getData = (offset, limit, start, end, type) => {
    if (workspaces.length > 0) {
      // Property Units
      let date = new Date();
      if (start !== "") {
        date = new Date(start);
        start = date.toISOString();
      }
      if (end !== "") {
        date = new Date(end);
        end = date.toISOString();
      }
      let url = '/ledger-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/ledger-transactions';
      let config = {
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
          'offset': offset,
          'limit': limit,
          'notBefore': start,
          'notAfter': end
        }
      }
      if (type === 0) {
        // setLoadingState(true);
        setPageLoading({
          loginStatus: true,
          loginText: 'Loading...'
        });
      } else {
        setTableLoadingState(true);
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
              sn: offset + index + 1,
              amount: 'N' + item.amount.toLocaleString(),
              // resident_name: item.creatorName,
              resident_name: item.tenure.primaryResidents[0].displayName,
              unit_address: item.tenure.propertyUnit.houseNumber + ' ' + item.tenure.propertyUnit.streetName,
              payment_type: payment_type_str,
              payment_mode: item.type,
              date: create_at.toISOString().split('T')[0]
            })
          })

          setServiceCharge(serviceData);
          totalRow.current = res.data.total;
          let text = (offset + 1) + " - " + (offset + parseInt(limit)) + " of " + res.data.total;
          setPaginationText(text);
          if (type === 0) {
            // setLoadingState(false);
            setPageLoading({
              loginStatus: false,
              loginText: 'Loading...'
            });
          } else {
            setTableLoadingState(false);
          }

        })
        .catch(err => {
          console.log('Property Unit', err);
          props.history.push('/login');
        })
    }
  }

  const onPageChange = (e) => {
    setCurrentPage(1);
    setPageCount(e.target.value);
    getData(0, e.target.value, startDate, endDate, 1);
  };

  const onPrevPage = (e) => {
    if (currentPage === 1) return;
    let prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    let offset = (prevPage - 1) * pageCount;
    getData(offset, pageCount, startDate, endDate, 1);
  }

  const onNextPage = (e) => {
    let totalPage = 0;
    if (totalRow.current % pageCount === 0) {
      totalPage = totalRow.current / pageCount;
    } else {
      totalPage = Math.trunc(totalRow.current / pageCount) + 1;
    }

    if (totalPage === currentPage) return;

    let nextpage = currentPage + 1;
    setCurrentPage(nextpage);
    let offset = (nextpage - 1) * pageCount;
    getData(offset, pageCount, startDate, endDate, 1);
  }

  const onStartDate = (e) => {
    setStartDate(e.target.value);
  }

  const onEndDate = (e) => {
    setEndDate(e.target.value);
  }

  const onFilter = () => {
    setCurrentPage(1);
    getData(0, pageCount, startDate, endDate, 1);
  }


  return (
    <Container fluid className="main-content-container">
      {loadingState === true ? <Loading /> : null}
      <Row className="page-header py-4">
        <Col lg='4' md='12' sm='12'>
          <p className="content-title">Service Charge Payments</p>
        </Col>
        <Col lg='8' md='12' sm='12' className="pt-2">
          <div className="d-flex justify-content-end align-items-center right-button-wrapper">
            <div className="d-flex align-items-center">
              <input type="date" onChange={(e) => onStartDate(e)} className="search-text mr-2" value={startDate} />
              <input type="date" onChange={(e) => onEndDate(e)} className="search-text mr-2" value={endDate} />
              <button className="btn record-btn mr-2" onClick={onFilter}>Filter</button>
            </div>
            <ExportTo columns={columns} dataSource={[...serviceCharge]} filename={"Service Charge Payment"} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-0 pb-3">
              <div className="table-wrapper" id="table-wapper">
                <Table
                  dataSource={serviceCharge}
                  columns={columns}
                  pagination={false}
                  loading={tableLoadingState}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-end align-items-center">
        <p className="pagination-per-page">Rows Per Page: </p>
        <select
          className="selectPage"
          onChange={(e) => onPageChange(e)}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <p className="pagination-per-page">{paginationText}</p>
        <button className="pre-next" onClick={(e) => onPrevPage()}><i className="material-icons">navigate_before</i></button>
        <button className="pre-next" onClick={(e) => onNextPage()}><i className="material-icons">navigate_next</i></button>
      </div>
    </Container>
  )
}

export default SCPayment;
