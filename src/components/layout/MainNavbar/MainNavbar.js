import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Container, Badge, Row, DropdownItem, Dropdown, DropdownMenu, Modal, ModalBody } from "shards-react";
import NavbarToggle from "./NavbarToggle";
import BootstrapSelect from 'react-bootstrap-select-dropdown';
import withHook from "../../common/withHook";

const MainNavbar = (props) => {
  const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const classes = classNames(
    "main-navbar",
    "bg-white",
    "sticky-top",
    "d-flex",
    "align-items-center"
  );
  useEffect(() => {
    if(Object.keys(props.userInfor).length > 0) {
      const myName = props.userInfor.displayName.split(" ");
      setUserName(myName[0].charAt(0) + myName[1].charAt(0));
      setWorkspaceName(props.workspaces[props.index].workspaceName);
    } else {
      props.history.push('/login');
    }
  }, [])

  const toggleNotifications = () => {
    const visibleStat = !visible
    setVisible(visibleStat);
  }


  
  return(
    <div className={classes}>
      <Container className="p-0 d-flex justify-content-between item-align-center">
        <div className="segee">{workspaceName.toUpperCase()}</div>
        <div className="d-flex justify-content-end align-items-center header-btn-group">
          <div className="nick-name">{userName}</div>
          <div className="user-name">{Object.keys(props.userInfor).length > 0 ? props.userInfor.displayName : null}</div>
          <Dropdown open={visible} toggle={toggleNotifications} className="d-table">
              <div className="nav-link-icon__wrapper noti-bar d-table d-flex align-items-center" onClick={toggleNotifications}>
                <i className="material-icons noti-icon">&#xE7F4;</i>
                <Badge pill theme="danger" className="noti-badge">
                  2
                </Badge>
              </div>
            <DropdownMenu right className="dropdown-menu-width">
              <DropdownItem className="dropdown-item-space">
                <div className="notification__icon-wrapper">
                  <div className="notification__icon">
                    <i className="material-icons">&#xE6E1;</i>
                  </div>
                </div>
                <div className="notification__content">
                  <span className="notification__category">Analytics</span>
                  <p>
                    Your website’s active users count increased by{" "}
                    <span className="text-success text-semibold">28%</span> in the
                    last week. Great job!
                  </p>
                </div>
              </DropdownItem>
              <DropdownItem className="dropdown-item-space">
                <div className="notification__icon-wrapper">
                  <div className="notification__icon">
                    <i className="material-icons">&#xE8D1;</i>
                  </div>
                </div>
                <div className="notification__content">
                  <span className="notification__category">Sales</span>
                  <p>
                    Last week your store’s sales count decreased by{" "}
                    <span className="text-danger text-semibold">5.52%</span>. It
                    could have been worse!
                  </p>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> 
          <NavbarToggle />         
        </div>

      </Container>
    </div>
  )
}

// const MainNavbar = (props) => {
//   const classes = classNames(
//     "main-navbar",
//     "bg-white",
//     "sticky-top"
//   );

//   const toggleNotifications = () => {
//     const visibleStat = !visible
//     setVisible(visibleStat);
//   }

//   const [modalOpen, setModalOpen] = useState(false);
//   const [visible, setVisible] = useState(false);
  
//   const onModalToggle = () => {
//     const toggle = !modalOpen;
//     setModalOpen(toggle);
//   }

//   const onPayment = () => {
//     props.history.push('/record-payment');
//   }

//   const options = [
//     {
//       "labelKey": "John Doe - 117 Olive Drive",
//       "value": "John Doe - 117 Olive Drive"
//     },
//     {
//       "labelKey": "James Andrew - 89 Palm Drive",
//       "value": "James Andrew - 89 Palm Drive"
//     },
//     {
//       "labelKey": "Jerry Precious - 90 Olive Drive",
//       "value": "Jerry Precious - 90 Olive Drive"
//     }
//   ]

//   const handleChange = (value) => {
//     console.log('change')
//     console.log(value.selectedValue[0]);
//   }

//   return(
//     <div className={classes}>
//       <Container className="p-0 d-flex justify-content-between item-align-center">
//         <div className="segee">SEGEE ESTATE</div>
//         <div className="d-flex justify-content-end align-items-center header-btn-group">
//           <button className="btn record-btn" onClick={(e) => onModalToggle()}>Record Payment</button>
//           <button className="btn record-btn">Record Expense</button>
//           <div className="nick-name">JD</div>
//           <div className="user-name">Jonh Doe</div>
//           <div className="nav-link-icon__wrapper noti-bar">
//             <i className="material-icons noti-icon">&#xE7F4;</i>
//             <Badge pill theme="danger" className="noti-badge">
//               2
//             </Badge>
//           </div>          
//         </div>
//         <Modal classes="modal-pro-unit" size="md" open={modalOpen} toggle={onModalToggle}>
//           <ModalBody>
//             <div className="d-flex justify-content-between align-items-center">
//               <div className="modal-title modal-payment-title">Record Payment</div>
//               <div className="modal-close-wrap"><a href="#" className="modal-close" onClick={onModalToggle}><i className="material-icons">close</i></a></div>
//             </div>
//             <div className="modal-pro-content">
//               <Row>
//                 <BootstrapSelect options={options} showSearch={true} onChange={handleChange} placeholder="Select Residence" />
//               </Row>
//                 <button className="btn modal-pro-btn" onClick={(e) => onPayment()}>Proceed</button>

//             </div>
//           </ModalBody>
//         </Modal>
//       </Container>
//     </div>
//   )
// }



// const MainNavbar = ({ layout, stickyTop }) => {
//   const classes = classNames(
//     "main-navbar",
//     "bg-white",
//     stickyTop && "sticky-top"
//   );

//   const [modalOpen, setModalOpen] = useState(false);
  
//   const onModalToggle = () => {
//     const toggle = !modalOpen;
//     setModalOpen(toggle);
//   }

//   const onPayment = () => {

//   }

//   const options = [
//     {
//       "labelKey": "John Doe - 117 Olive Drive",
//       "value": "John Doe - 117 Olive Drive"
//     },
//     {
//       "labelKey": "James Andrew - 89 Palm Drive",
//       "value": "James Andrew - 89 Palm Drive"
//     },
//     {
//       "labelKey": "Jerry Precious - 90 Olive Drive",
//       "value": "Jerry Precious - 90 Olive Drive"
//     }
//   ]

//   const handleChange = (e) => {
//     console.log(e);
//   }

//   return (
//     <div className={classes}>
//       <Container className="p-0 d-flex justify-content-between item-align-center">
//         <div className="segee">SEGEE ESTATE</div>
//         <div className="d-flex justify-content-end header-btn-group">
//           <button className="btn record-btn" onClick={(e) => onModalToggle()}>Record Payment</button>
//           <button className="btn record-btn">Record Expense</button>
//           <div className="nick-name">JD</div>
//           <div className="user-name">Jonh Doe</div>
//           <div className="nav-link-icon__wrapper noti-bar">
//             <i className="material-icons noti-icon">&#xE7F4;</i>
//             <Badge pill theme="danger" className="noti-badge">
//               2
//             </Badge>
//           </div>
//           <NavbarToggle /> 
//         </div>
//         <Modal classes="modal-pro-unit" size="md" open={modalOpen} toggle={onModalToggle}>
//           <ModalBody>
//             <div className="d-flex justify-content-between align-items-center">
//               <div className="modal-title modal-payment-title">Record Payment</div>
//               <div className="modal-close-wrap"><a href="#" className="modal-close" onClick={onModalToggle}><i className="material-icons">close</i></a></div>
//             </div>
//             <div className="modal-pro-content">
//               <Row>
//                 <BootstrapSelect options={options} showSearch={true} onChange={(e) => handleChange()} placeholder="Select Residence" />
//               </Row>
//                 <button className="btn modal-pro-btn" onClick={(e) => onPayment()}>Proceed</button>

//             </div>
//           </ModalBody>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// const MainNavbar = ({ layout, stickyTop }) => {
//   const classes = classNames(
//     "main-navbar",
//     "bg-white",
//     stickyTop && "sticky-top"
//   );

//   return (
//     <div className={classes}>
//       <Container className="p-0 d-flex justify-content-between item-align-center">
//         <div className="segee">SEGEE ESTATE</div>
//         <div className="d-flex justify-content-end header-btn-group">
//           <button className="btn record-btn">Record Payment</button>
//           <button className="btn record-btn">Record Expense</button>
//           <div className="nick-name">JD</div>
//           <div>Jonh Doe</div>
//           <NavbarToggle /> 
//         </div>
//       </Container>
//     </div>
//   );
// };

// const MainNavbar = ({ layout, stickyTop }) => {
//   const classes = classNames(
//     "main-navbar",
//     "bg-white",
//     "d-flex",
//     "justify-content-between",
//     "item-align-center",
//     stickyTop && "sticky-top"
//   );

//   return (
//     <div className={classes}>
//       <div>SEGEE ESTATE</div>
//       <div className="d-flex justify-content-end">
//         <button className="btn record-btn">Record Payment</button>
//         <button className="btn record-btn">Record Expense</button>
//         <div className="nick-name">JD</div>
//         <div>Jonh Doe</div>

//       </div>
//       <NavbarToggle />
//     </div>
//   );
// };

// const MainNavbar = ({ layout, stickyTop }) => {
//   const classes = classNames(
//     "main-navbar",
//     "bg-white",
//     stickyTop && "sticky-top"
//   );

//   return (
//     <div className={classes}>
//       <Container className="p-0">
//         <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
//           <NavbarSearch />
//           <NavbarNav />
//           <NavbarToggle />
//         </Navbar>
//       </Container>
//     </div>
//   );
// };

// MainNavbar.propTypes = {

//   layout: PropTypes.string,

//   stickyTop: PropTypes.bool
// };

// MainNavbar.defaultProps = {
//   stickyTop: true
// };

export default withHook(MainNavbar);
