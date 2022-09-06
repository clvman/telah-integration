import React, {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import { Table, Select } from 'antd';
import 'antd/dist/antd.css';
import {
  Card,
  CardHeader,
  CardBody,
} from "shards-react";
import ExportTo from '../components/export/ExportTo';
import { useProduct } from '../context/proudctContext';
import axios from 'axios';
import Loading from '../components/common/Loading';

const { Option } = Select;

function Debtors (props) {
  const columns = [
    {
      title: 'SN',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: 'Resident Name',
      dataIndex: 'resident_name',
      key: 'resident_name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Unit Address',
      dataIndex: 'unit_address',
      key: 'unit_address',
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
    },
  ];

  const selectRow = useRef({});
  const totalRow = useRef(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [tableLoadingState, setTableLoadingState] = useState(false);
  const [debortData, setDebortData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [paginationText, setPaginationText] =useState("1 - 5 of 0");
  const [paymentType, setPaymentType] = useState("");
  const {userInfor, workspaces, currentWorkspaceIndex, setPageLoading} = useProduct();

  useEffect(() => {
      // setPageLoading({
      //   loginStatus: true,
      //   loginText: 'Loading...'      
      // });
      if(Object.keys(userInfor).length === 0) {
        props.history.push('/login');
      }

      getData(0, 5, '', 0, paymentType);
  }, []);

  const getData = (offset, limit, query, type, paymentType) => {
    if(workspaces.length > 0){
      // Property Units
      let url = '/ledger-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/tenure-ledgers';
      let config = {};  
      if(paymentType === "") {
        config = {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Authorization': 'Bearer ' + userInfor.accessToken
          },
          params: {
            'hasOutstanding': true,
            'offset': offset,
            'limit': limit,
            'query': query,
            'type': 'AMENITY'
          }
        }  
      } else {
        config = {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Authorization': 'Bearer ' + userInfor.accessToken
          },
          params: {
            'hasOutstanding': true,
            'offset': offset,
            'limit': limit,
            'query': query,
            'type': paymentType
          }
        }  
      }
      // console.log(paymentType);
      // console.log(config);
      if(type === 0) {
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
          let debort = [];
          res.data.results.map((item, index) => {
            let created_at = new Date(item.tenure.createdAt);
            let payment_type_str = "Service Charge";
            if(item.type === "PROJECT") {
              payment_type_str = item.project.name;
            }

            debort.push({
              kye: index,
              sn: offset + index + 1,
              resident_name: item.tenure.primaryResidents[0].displayName,
              amount: 'N' + item.totalIssued.toLocaleString(),
              unit_address: item.tenure.propertyUnit.houseNumber + ' ' + item.tenure.propertyUnit.streetName,
              purpose: payment_type_str,
              date: created_at.toISOString().split('T')[0],
            })
          });
          setDebortData(debort);
          totalRow.current = res.data.total;
          let text = (offset + 1) + " - " + (offset + parseInt(limit)) + " of " +  res.data.total;
          setPaginationText(text);
          if(type === 0) {
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
    } else {
      props.history.push('/login');
    }
  }

  // const onSearchText = (e) => {
  //   setSearchText(e.target.value);   
  // }

  // const onFilter = () => {
  //   setCurrentPage(1);
  //   getData(0, pageCount, searchText, 1);
  // }

  const onPageChange = (e) => {
    setCurrentPage(1);
    setPageCount(e.target.value);
    getData(0, e.target.value, searchText, 1, paymentType);
  };

  const onPrevPage = (e) => {
    if(currentPage === 1) return;
    let prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    let offset = (prevPage - 1) * pageCount;
    getData(offset, pageCount, searchText, 1, paymentType);
  }

  const onNextPage = (e) => {
    let totalPage = 0;
    if(totalRow.current % pageCount === 0) {
      totalPage = totalRow.current / pageCount;
    } else {
      totalPage = Math.trunc(totalRow.current / pageCount) + 1;
    }

    if(totalPage === currentPage) return;
    
    let nextpage = currentPage + 1;
    setCurrentPage(nextpage);
    let offset = (nextpage - 1) * pageCount;
    getData(offset, pageCount, searchText, 1, paymentType);
  }

  const paymentTypeChange = (e) => {
    setPaymentType(e);
    getData(0, pageCount, searchText, 1, e);
  }


  return(
      <Container fluid className="main-content-container">
        {loadingState === true ? <Loading /> : null}
        <Row className="page-header py-4 d-flex align-items-center">
          <Col lg='4' md='12' sm='12'>
            <p className="content-title">Debtors</p>
          </Col>
          <Col lg='8' md='12' sm='12' className="pt-2">
            <div className="d-flex justify-content-end flex-row align-items-center right-button-wrapper">
              <div className="d-flex align-items-center">
                <Select className="antdFilter" defaultValue="Filter Debtors" onChange={paymentTypeChange}>
                  <Option value="AMENITY">Service Charge</Option>
                  <Option value="PROJECT">Project</Option>
                </Select>
              </div>
              <ExportTo columns={columns} dataSource={[...debortData]} filename={"Debort"} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardBody className="p-0 pb-3">
                <div className="table-wrapper" id="table-wapper">
                  <Table 
                    dataSource={debortData} 
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

export default Debtors;