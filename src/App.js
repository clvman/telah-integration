import React, { Compoent } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";
import { ProductContextProvider } from './context/proudctContext';

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.css";

export default () => (
  <Router basename={process.env.REACT_APP_BASENAME || ""}>
    <ProductContextProvider>
      {routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={
              route.path === '/login' ? withTracker(props => {
                    return (
                        <route.component {...props} />
                    );
                  })
              : withTracker(props => {
                    return (
                      <route.layout {...props}>
                        <route.component {...props} />
                      </route.layout>
                    );
                  })
            }
          />
        );
      })}
    </ProductContextProvider>
  </Router>
);
