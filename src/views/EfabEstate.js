import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import { Table } from 'antd';
import 'antd/dist/antd.css';
import {
  Card,
  CardHeader,
  CardBody,
} from "shards-react";



function EfabEstate () {
  return(
    <Container fluid className="main-content-container">
      <Row className="page-header py-4">
        <Col lg='4' md='12'>
          <p className="content-title">Efab Estate</p>
        </Col>
      </Row>


    </Container>
  )
}

export default EfabEstate;