import Logo from '../Logo';
import Nav from '~/components/Nav';
import React from 'react';
import asideConfig from '~/config/aside';

function Aside() {
  return (
    <div className="basic-layout-aside">
      <Logo className="basic-layout-aside-logo" />

      <div className="basic-layout-aside-user-info">
        <img
          height={40}
          width={40}
          src="https://avatars1.githubusercontent.com/u/6262382?s=460&v=4"
          className="basic-layout-aside-user-avatar"
          alt="Jesse Feng"
        />
        <div className="basic-layout-aside-user-profile">
          <span className="basic-layout-aside-user-name">Jesse Feng</span>
          <br />
          <span className="basic-layout-aside-user-department">技术部</span>
        </div>
      </div>

      <Nav items={asideConfig} />
    </div>
  );
}

export default Aside;
