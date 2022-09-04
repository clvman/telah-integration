import React from "react";
import { Nav } from "shards-react";
// import { useProduct } from '../context/proudctContext';
import SidebarNavItem from "./SidebarNavItem";
import { Store } from "../../../flux";
import withHook from "../../common/withHook";

class SidebarNavItems extends React.Component {
  // const { setUserInfor } = useProduct();

  constructor(props) {
    super(props)

    this.state = {
      navItems: Store.getSidebarItems(),
      workspaces: props.workspaces
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      navItems: Store.getSidebarItems()
    });
  }

  render() {
    const { navItems: items } = this.state;
    const logout = {
      title: 'Logout',
      empty: 0,
      to: "/logout",
      htmlBefore: '<i class="material-icons">logout</i>',
      htmlAfter: "" 
    }
    const empty=     {
      title: "",
      empty: 1,
      htmlBefore: '',
      to: "/space",
    };

    return (
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {items.map((item, idx) => (
            <SidebarNavItem key={idx} item={item} />
          ))}
          {this.state.workspaces.map((item, index) => {
            let itemObject = {
              title: item.workspaceName,
              empty: 0,
              to: "/workspace/" + index,
              htmlBefore: '<i class="material-icons">bar_chart</i>',
              htmlAfter: ""              
            };
            return <SidebarNavItem key={100 + index} item={itemObject} />
          })}
          <SidebarNavItem key={200} item={empty} />
          <SidebarNavItem key={201} item={logout} />
        </Nav>
      </div>
    )
  }
}

export default withHook(SidebarNavItems);
