import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink } from "react-router-dom";
import { NavItem, NavLink } from "shards-react";


const SidebarNavItem = ({ item }) => (
  <NavItem>
    {item.empty === 2 || item.empty === 1 ? (    
      <NavLink disabled className={item.empty === 1 ? "nav-empty" : "nav-sapce"} tag={RouteNavLink} to={item.to}>
        {item.htmlBefore && (
          <div
            className="d-inline-block item-icon-wrapper"
            dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
          />
        )}
        {item.title && <span>{item.title}</span>}
        {item.htmlAfter && (
          <div
            className="d-inline-block item-icon-wrapper"
            dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
          />
        )}
      </NavLink>
    ) : (    
      <NavLink tag={RouteNavLink} to={item.to}>
        {item.htmlBefore && (
          <div
            className="d-inline-block item-icon-wrapper"
            dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
          />
        )}
        {item.title && <span>{item.title}</span>}
        {item.htmlAfter && (
          <div
            className="d-inline-block item-icon-wrapper"
            dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
          />
        )}
      </NavLink>
    )}

  </NavItem>
);

// const SidebarNavItem = ({ item }) => (
//   <NavItem>
//     {item.title === "MY SPACES" ? (    
//       <NavLink disabled className="navebar-space" tag={RouteNavLink} to={item.to}>
//         {item.htmlBefore && (
//           <div
//             className="d-inline-block item-icon-wrapper"
//             dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
//           />
//         )}
//         {item.title && <span>{item.title}</span>}
//         {item.htmlAfter && (
//           <div
//             className="d-inline-block item-icon-wrapper"
//             dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
//           />
//         )}
//       </NavLink>
//     ) : (    
//       <NavLink tag={RouteNavLink} to={item.to}>
//         {item.htmlBefore && (
//           <div
//             className="d-inline-block item-icon-wrapper"
//             dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
//           />
//         )}
//         {item.title && <span>{item.title}</span>}
//         {item.htmlAfter && (
//           <div
//             className="d-inline-block item-icon-wrapper"
//             dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
//           />
//         )}
//       </NavLink>
//     )}

//   </NavItem>
// );

// const SidebarNavItem = ({ item }) => (
//   <NavItem>
//     <NavLink tag={RouteNavLink} to={item.to}>
//       {item.htmlBefore && (
//         <div
//           className="d-inline-block item-icon-wrapper"
//           dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
//         />
//       )}
//       {item.title && <span>{item.title}</span>}
//       {item.htmlAfter && (
//         <div
//           className="d-inline-block item-icon-wrapper"
//           dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
//         />
//       )}
//     </NavLink>
//   </NavItem>
// );

SidebarNavItem.propTypes = {
  /**
   * The item object.
   */
  item: PropTypes.object
};

export default SidebarNavItem;
