import { Col, DatePicker, Form, Input, Row, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { columns, query } from './service';

const { RangePicker } = DatePicker;
const { Search } = Input;

function Order() {
  const [loading, setLoading] = useState(false);
  const [ds, setDS] = useState([]);
  const onSearch = useCallback(value => {
    setLoading(true);
    query().then(({ items }) => {
      setDS(items);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    onSearch();
  }, [onSearch]);

  return (
    <div className="basic-layout-container page-order">
      <Form className="page-order-condition">
        <Row gutter={[16, 16]}>
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
          dataSource={ds}
          loading={loading}
          rowKey="id"
        />
      </div>
    </div>
  );
}

export default Order;
