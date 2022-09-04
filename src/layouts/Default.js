import React, {useEffect} from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import Loading from '../components/common/Loading';
import { useProduct } from '../context/proudctContext';



const DefaultLayout = ({ children, noNavbar, noFooter, ...props }) => {
  const {pageLoading} = useProduct();
  return(
    <Container fluid>
      {pageLoading.loginStatus === true ? <Loading text={pageLoading.loginText} /> : null}
    <Row>
      <MainSidebar />
      <Col
        className="main-content p-0"
        lg={{ size: 10, offset: 2 }}
        md={{ size: 9, offset: 3 }}
        sm="12"
        tag="main"
      >
        {!noNavbar && <MainNavbar {...props} />}
        {children}

      </Col>
    </Row>
  </Container>    
  )
};

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

DefaultLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default DefaultLayout;