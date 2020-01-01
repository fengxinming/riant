import { Icon, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import React, { memo } from 'react';

const { isArray } = Array;

function createItemName(nav) {
  return (
    <>
      <Icon x-if={nav.icon} type={nav.icon} />
      <span>{nav.text}</span>
    </>
  );
}

function createMenu(items) {
  return isArray(items) && items.length > 0
    ? items.map((nav, index) => {
        const { children } = nav;
        if (children) {
          return (
            <Menu.SubMenu key={nav.path} title={createItemName(nav)}>
              {createMenu(children)}
            </Menu.SubMenu>
          );
        } else {
          const url = nav.path + (nav.search || '');
          let { external } = nav;
          external = external === true ? { target: '_blank' } : external;
          return (
            <Menu.Item key={nav.path}>
              {external ? (
                <a {...external} href={url}>
                  {createItemName(nav)}
                </a>
              ) : (
                <Link to={url}>{createItemName(nav)}</Link>
              )}
            </Menu.Item>
          );
        }
      })
    : null;
}

function Nav({ className, mode, theme, items }) {
  const { pathname } = useLocation();

  return (
    <Menu
      className={className}
      mode={mode || 'inline'}
      theme={theme || 'light'}
      selectedKeys={[ pathname ]}
    >
      {createMenu(items)}
    </Menu>
  );
}

export default memo(Nav);
