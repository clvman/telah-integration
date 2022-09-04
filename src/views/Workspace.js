import React, { useEffect } from "react";
import { Container } from "shards-react";
import { useProduct } from '../context/proudctContext';

function Workspace (props) {
  const { currentWorkspaceIndex, setCurrentWorkspaceIndex, workspaceChange, setWorkspaceChange } = useProduct();
  useEffect(() => {
    if(props.match.params.id !== currentWorkspaceIndex) {
      setWorkspaceChange(true);
    }

    setCurrentWorkspaceIndex(props.match.params.id);
    
    props.history.push('/dashboard');
  }, []);
  return(
    <Container fluid className="main-content-container">
    </Container>
  )
}

export default Workspace;