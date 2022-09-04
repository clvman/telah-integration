import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import Login from './views/Login';
import Dashboard from "./views/Dashboard";
import SCPayment from "./views/SCPayment";
import ProPayment from "./views/ProPayment";
import PropertyUnits from "./views/PropertyUnits";
import Errors from "./views/Errors";
import RecordPayment from "./views/RecordPayment";
import RecordExpense from "./views/RecordExpense";
import Expenses from "./views/Expenses";
import KafeGardenEstate from "./views/KafeGardenEstate";
import EfabEstate from "./views/EfabEstate";
import Debtors from "./views/Debtors";
import Workspace from "./views/Workspace";
import Logout from "./views/Logout";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/login" />
  },
  {
    path: "/login",
    layout: DefaultLayout,
    component: Login
  },  
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: Dashboard
  },
  {
    path: "/property-units",
    layout: DefaultLayout,
    component: PropertyUnits
  },
  {
    path: "/service-charge-payment",
    layout: DefaultLayout,
    component: SCPayment
  },
  {
    path: "/projects-payments",
    layout: DefaultLayout,
    component: ProPayment
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/record-payment/:id/:name",
    layout: DefaultLayout,
    component: RecordPayment
  },
  {
    path: "/record-expense",
    layout: DefaultLayout,
    component: RecordExpense
  },
  {
    path: "/expenses",
    layout: DefaultLayout,
    component: Expenses
  },
  {
    path: "/kafe-garden-estate",
    layout: DefaultLayout,
    component: KafeGardenEstate
  },
  {
    path: "/efab-estate",
    layout: DefaultLayout,
    component: EfabEstate
  },
  {
    path: "/debtors",
    layout: DefaultLayout,
    component: Debtors
  },
  {
    path:"/workspace/:id",
    layout: DefaultLayout,
    component: Workspace
  },
  {
    path:"/logout",
    layout: DefaultLayout,
    component: Logout
  }
];

// export default [
//   {
//     path: "/",
//     exact: true,
//     layout: DefaultLayout,
//     component: () => <Redirect to="/blog-overview" />
//   },
//   {
//     path: "/blog-overview",
//     layout: DefaultLayout,
//     component: BlogOverview
//   },
//   {
//     path: "/user-profile-lite",
//     layout: DefaultLayout,
//     component: UserProfileLite
//   },
//   {
//     path: "/add-new-post",
//     layout: DefaultLayout,
//     component: AddNewPost
//   },
//   {
//     path: "/errors",
//     layout: DefaultLayout,
//     component: Errors
//   },
//   {
//     path: "/components-overview",
//     layout: DefaultLayout,
//     component: ComponentsOverview
//   },
//   {
//     path: "/tables",
//     layout: DefaultLayout,
//     component: Tables
//   },
//   {
//     path: "/blog-posts",
//     layout: DefaultLayout,
//     component: BlogPosts
//   }
// ];
