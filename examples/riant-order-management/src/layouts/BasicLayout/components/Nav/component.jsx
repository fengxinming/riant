import React from 'react';
import Nav from '~/components/Nav';
import { navConfig } from '~/config/menu';

function NavBar(props) {
  return (
    <div className="basic-layout-nav">
      <Nav {...props} mode="horizontal" items={navConfig} />
    </div>
  );
}

export default NavBar;
