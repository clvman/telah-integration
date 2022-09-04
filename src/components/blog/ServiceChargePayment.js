import React from "react";
import { Container, Row, Col } from "shards-react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  FormTextarea,
  Button
} from "shards-react";

const NewDraft = ({ title }) => (
  <Card small className="h-100">
    <CardBody className="d-flex flex-column">
      <p className="payment-p">Service Charge Payments</p>
      <Row>
        <Col lg="6" md="6" sm="6">
          <div className="payment-price-green">N3,000,500</div>
          <div className="serice-charge-payment-total"><i className="material-icons icon-green">arrow_upward</i>Total Paid This month</div>  
        </Col>
        <Col lg="6" md="6" sm="6">
          <div className="payment-price-red">N3,000,500</div>
          <div className="serice-charge-payment-total"><i className="material-icons icon-red">arrow_downward</i>Total Outstanding</div>  
        </Col>        
      </Row>
    </CardBody>
  </Card>
);

NewDraft.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

NewDraft.defaultProps = {
  title: "New Draft"
};

export default NewDraft;
