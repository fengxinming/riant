import Aside from './components/Aside';
import { Layout } from 'antd';
import Nav from './components/Nav';
import React from 'react';

export default function BasicLayout({ children }) {
  return (
    <Layout className="basic-layout">
      <Layout.Sider theme="light" width={240}>
        <Aside />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="basic-layout-header">
          <Nav />
        </Layout.Header>
        <Layout.Content className="basic-layout-content">
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
