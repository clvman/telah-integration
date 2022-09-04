import React, { useEffect } from 'react';
import { useProduct } from '../../context/proudctContext';

function withHook (Component) {
    return function WrappedComponent(props) {
        const { userInfor, workspaces, currentWorkspaceIndex } = useProduct();
        return <Component {...props} userInfor={userInfor} workspaces={workspaces} index={currentWorkspaceIndex} />;
      };
}

export default withHook;