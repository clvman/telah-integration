import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Modal, ModalHeader, ModalBody  } from "shards-react";
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { Card, CardHeader, CardBody } from "shards-react";
import ExportTo from '../components/export/ExportTo';
import { useProduct } from '../context/proudctContext';
import axios from 'axios';
import Loading from '../components/common/Loading';

function PropertyUnits(props) {
  // const dataSource = [
  //   {
  //     key: 0,
  //     sn: 0,
  //     resident_name: 'Olaleye Afolabi',
  //     unit_address: '32 Franklin Stret - 1',
  //     phone_number: '07084521487',
  //     date_added: '10-12-2022'
  //   },
  //   {
  //     key: 1,
  //     sn: 1,
  //     resident_name: 'Ochai Samuel',
  //     unit_address: '15 Main Steet',
  //     phone_number: '07084521487',
  //     date_added: '10-12-2022'
  //   },
  //   {
  //     key: 2,
  //     sn: 2,
  //     resident_name: 'Ebimowei Okpongu',
  //     unit_address: 'Whispering pines - 07',
  //     phone_number: '07084521487',
  //     date_added: '10-12-2022'
  //   },
  //   {
  //     key: 3,
  //     sn: 3,
  //     resident_name: 'John Doe',
  //     unit_address: '32 Franklin Stret - 1',
  //     phone_number: '07084521487',
  //     date_added: '10-12-2022'
  //   },
  //   {
  //     key: 4,
  //     sn: 4,
  //     resident_name: 'Olaleye Afolabi',
  //     unit_address: '15 Main Steet',
  //     phone_number: '07084521487',
  //     date_added: '10-12-2022'
  //   },
  //     {
  //     key: 5,
  //     sn: 5,
  //     resident_name: 'Ochai Samuel',
  //     unit_address: 'Whispering pines - 07',
  //     phone_number: '07084521487',
  //     date_added: '10-12-2022'
  //   },
  //   {
  //     key: 6,
  //     sn: 6,
  //     resident_name: 'Ebimowei Okpongu',
  //     unit_address: '32 Franklin Stret - 1',
  //     phone_number: '07084521487',
  //     date_added: '10-12-2022'
  //   }
  // ];

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
      title: 'Unit address',
      dataIndex: 'unit_address',
      key: 'unit_address',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Date Added',
      dataIndex: 'date_added',
      key: 'date_added',
    },
  ];

  // const text = '1-5 of ' + dataSource.length;
  // const [tableData, setTableData] = useState({
  //   currentPage: 1,
  //   perPageNum: 5,
  //   searchText: '',
  //   text: text,
  //   data: dataSource.slice(0, 5)
  // });
  const selectRow = useRef({});
  const totalRow = useRef(0);
  const tenantsCount = useRef(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [tableLoadingState, setTableLoadingState] = useState(false);
  const [propertyUnits, setPropertyUnits] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [paginationText, setPaginationText] =useState("1 - 5 of 0");
  const {userInfor, workspaces, currentWorkspaceIndex, setPageLoading} = useProduct();

  useEffect(() => {
      // setPageLoading({
      //   loginStatus: true,
      //   loginText: 'Loading...'      
      // });
      if(Object.keys(userInfor).length === 0) {
        props.history.push('/login');
      }

      getData(0, 5, '', 0);
  }, []);

  const getData = (offset, limit, query, type) => {
    if(workspaces.length > 0){
      // Property Units
      let url = '/property-api/workspaces/' + workspaces[currentWorkspaceIndex].workspaceId + '/property-units';
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': 'Bearer ' + userInfor.accessToken
        },
        params: {
          'offset': offset,
          'limit': limit,
          'query': query
        }
      }  
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
          let propertyUnits = [];
          res.data.results.map((item, index) => {
            let created_at = new Date(item.property.createdAt);
            let owner = {};
            let tenants = [];
            let ownerPercent = 100;
            item.activeTenures.map((tenuresItem, tenuresIndex) => {
              if(tenuresItem.type === "UNIT_OWNER") {
                owner.name = tenuresItem.primaryResidents[0].displayName;
                owner.address = item.houseNumber + ' ' + item.streetName;
                owner.type = item.billingGroup.name;
                owner.percent = ownerPercent
              } else {
                ownerPercent = ownerPercent - tenuresItem.serviceChargePercentage;
                tenants.push({
                  name: tenuresItem.primaryResidents[0].displayName,
                  percent: tenuresItem.serviceChargePercentage
                })
              }
            });

            owner.percent = ownerPercent;

            propertyUnits.push({
              kye: index,
              sn: offset + index + 1,
              resident_name: item.activeTenures[0].primaryResidents[0].displayName,
              unit_address: item.houseNumber + ' ' + item.streetName,
              phone_number: item.activeTenures[0].primaryResidents[0].phoneNumber,
              date_added: created_at.toISOString().split('T')[0],
              owner: owner,
              tenants: tenants
            })
          });
          setPropertyUnits(propertyUnits);
          totalRow.current = res.data.total;
          let text = (offset + 1) + " - " + parseInt(offset + parseInt(limit)) + " of " +  res.data.total;
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

  const onSearchText = (e) => {
    setSearchText(e.target.value);   
  }

  const onFilter = () => {
    setCurrentPage(1);
    getData(0, pageCount, searchText, 1);
  }

  const onPageChange = (e) => {
    setCurrentPage(1);
    setPageCount(e.target.value);
    getData(0, e.target.value, searchText, 1);
  };

  const onPrevPage = (e) => {
    if(currentPage === 1) return;
    let prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    let offset = (prevPage - 1) * pageCount;
    getData(offset, pageCount, searchText, 1);
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
    getData(offset, pageCount, searchText, 1);
  }

  const onModalToggle = () => {
    const toggle = !modalOpen;
    setModalOpen(toggle);
  }

  return(
    <Container fluid className="main-content-container">
      {loadingState === true ? <Loading /> : null}
      <Row className="page-header py-4 d-flex align-items-center">
        <Col lg='4' md='12' sm='12'>
          <p className="content-title">Property Units</p>
        </Col>
        <Col lg='8' md='12' sm='12' className="pt-2">
          <div className="d-flex justify-content-end flex-row align-items-center right-button-wrapper">
            <div className="d-flex align-items-center">
              <input type="text" onChange={(e) => onSearchText(e)} className="search-text mr-2" value={searchText} placeholder="search" />
              <button className="btn record-btn mr-2" onClick={onFilter}>Filter</button>
            </div>
            <ExportTo columns={columns} dataSource={[...propertyUnits]} filename={"ProertyUnits"} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-0 pb-3">
              <div className="table-wrapper" id="table-wapper">
                <Table 
                  onRow={(record, rowIndex) => {
                  return {
                      onClick: event => {selectRow.current = record; tenantsCount.current = selectRow.current.tenants.length; onModalToggle();}
                    };
                  }}
                  dataSource={propertyUnits} 
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

        <Modal size="lg" open={modalOpen} toggle={onModalToggle}>
          <ModalBody>
            <div className="d-flex justify-content-between align-items-center">
              <div className="modal-title">Property Details</div>
              <div className="modal-close-wrap"><a href="#" className="modal-close" onClick={onModalToggle}><i className="material-icons">close</i></a></div>
            </div>
            <Row className="modal-wapper">
              <Col lg="6" md="6">
                <div className="modal-owner">
                  Property Owner
                </div>
                <div className="modal-item">
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="modal-item-title">NAME</div>
                        <div className="modal-item-content">{Object.keys(selectRow.current).length > 0 ? selectRow.current.owner.name : null}</div>                     
                      </div>
                      <div className="modal-tenants-pay">{Object.keys(selectRow.current).length > 0 ? selectRow.current.owner.percent : null}%</div>
                    </div>
                </div>
                <div className="modal-item">
                  <div className="modal-item-title">ADDRESS</div>
                  <div className="modal-item-content">{Object.keys(selectRow.current).length > 0 ? selectRow.current.owner.address : null}</div>
                </div>
                <div className="modal-item">
                  <div className="modal-item-title">PROPERTY TYPE</div>
                  <div className="modal-item-content">{Object.keys(selectRow.current).length > 0 ? selectRow.current.owner.type : null}</div>
                </div>
              </Col>
              <Col lg="6" md="6">
                <div className="modal-tenants">
                  <div className="modal-tenants-title">
                    Tenants({tenantsCount.current})
                  </div>
                  {Object.keys(selectRow.current).length > 0 ? selectRow.current.tenants.map((itm, indx) => (
                    <div className="modal-tenants-content">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="modal-tenants-username">
                          <div className="modal-tenants-name">{itm.name}</div>                      
                        </div>
                        <div className="modal-tenants-pay">{itm.percent}%</div>
                      </div>
                    </div>                    
                  )) : <div>null</div>}

                  <div className="modal-tenants-down">
                    <a href="#" className="modal-tenants-a"><i className="material-icons arrow-down">keyboard_arrow_down</i></a>
                  </div>
                </div>
              </Col>              
            </Row>
          </ModalBody>
        </Modal>
    </Container>
  )
}

export default PropertyUnits;
