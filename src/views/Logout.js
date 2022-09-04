import React, { useEffect } from "react";
import { Container } from "shards-react";

function Logout (props) {
  useEffect(() => {
    props.history.push('/login');
  }, []);
  return(
    <Container fluid className="main-content-container">
    </Container>
  )
}

export default Logout;