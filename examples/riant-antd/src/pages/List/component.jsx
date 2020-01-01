import { Col, DatePicker, Form, Input, Row, Table } from 'antd';
import React, { useEffect, useCallback } from 'react';
import useFetchData from '~/hooks/useFetchData';
import { columns } from './service';

const { RangePicker } = DatePicker;
const { Search } = Input;

function Order() {
  const [ { data:{ items }, loading }, fetch ] = useFetchData({
    url: '/list',
    mock: true
  }, {});

  const onSearch = useCallback((value)=> {
    fetch({ keyword: value });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="basic-layout-container page-order">
      <Form className="page-order-condition">
        <Row gutter={[ 16, 16 ]}>
          <Col span={12}>
            <RangePicker />
          </Col>
          <Col span={12}>
            <Search
              placeholder="输入查询内容"
              onSearch={onSearch}
              enterButton
            />
          </Col>
        </Row>
      </Form>
      <div className="page-order-table">
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          rowKey="id"
        />
      </div>
    </div>
  );
}

export default Order;
