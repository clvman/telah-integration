import React, { createContext, useContext, useState } from 'react';

const PorductContext = createContext();

export function useProduct () {
    return useContext(PorductContext);
}

export function ProductContextProvider ({ children }) {
    const [userInfor, setUserInfor] = useState({});
    const [workspaces, setWorkspaces] = useState([]);
    const [currentWorkspaceIndex, setCurrentWorkspaceIndex] = useState(0);
    const [workspaceChange, setWorkspaceChange] = useState(false);
    const [pageLoading, setPageLoading] = useState({
      loginStatus: false,
      loginText: 'loading...'
    });
    
    const value = {
        userInfor,
        setUserInfor,
        workspaces,
        setWorkspaces,
        currentWorkspaceIndex,
        setCurrentWorkspaceIndex,
        pageLoading,
        setPageLoading,
        workspaceChange,
        setWorkspaceChange
    }

    return (
        <PorductContext.Provider value={value}>
          {children}
        </PorductContext.Provider>
      );
}

