import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Tooltip
} from 'antd';
import React, { useCallback, useMemo, useState } from 'react';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const formItemLayout = {
  labelCol: {
    sm: 8,
    xs: 24
  },
  wrapperCol: {
    sm: 16,
    xs: 24
  }
};
const noLabelFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};
const residences = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          {
            value: 'xihu',
            label: '西湖区'
          }
        ]
      }
    ]
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          {
            value: 'xuanwu',
            label: '玄武区'
          }
        ]
      }
    ]
  }
];

const Nickname = (
  <span>
    昵称&nbsp;
    <Tooltip title="What do you want others to call you?">
      <Icon type="question-circle-o" />
    </Tooltip>
  </span>
);

const websiteSuffix = ['.com', '.org', '.net'];

function RegistrationForm({ form }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const [website, setWebsite] = useState('');

  const currentWebsiteOptions = useMemo(() => {
    return website
      ? websiteSuffix.map(suffix => {
          suffix = website + suffix;
          return <AutoCompleteOption key={suffix}>{suffix}</AutoCompleteOption>;
        })
      : [];
  }, [website]);

  const PhoneCode = useMemo(() => {
    getFieldDecorator('phoneCode', {
      initialValue: '86'
    })(
      <Select style={{ width: 70 }}>
        <SelectOption value="86">+86</SelectOption>
        <SelectOption value="87">+87</SelectOption>
      </Select>
    );
  }, [getFieldDecorator]);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('values: ', values);
        }
      });
    },
    [validateFieldsAndScroll]
  );

  return (
    <div className="basic-layout-container page-form">
      <Row>
        <Col span={12}>
          <Form {...formItemLayout} onSubmit={onSubmit}>
            <FormItem label="E-mail">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: '请输入正确的Email地址'
                  },
                  {
                    required: true,
                    message: '请输入Email地址'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }]
              })(<Input />)}
            </FormItem>
            <FormItem label="确认密码">
              {getFieldDecorator('confirm', {
                rules: [{ required: true, message: '请输入确认密码' }]
              })(<Input />)}
            </FormItem>
            <FormItem label={Nickname}>
              {getFieldDecorator('nickname', {
                rules: [
                  { required: true, message: '请输入昵称', whitespace: true }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="区域">
              {getFieldDecorator('area', {
                initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                rules: [
                  { type: 'array', required: true, message: '请选择区域' }
                ]
              })(<Cascader options={residences} />)}
            </FormItem>
            <FormItem label="手机号码">
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: '请输入手机号码' }]
              })(<Input addonBefore={PhoneCode} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem label="主页">
              {getFieldDecorator('website', {
                rules: [{ required: true, message: '请输入主页网址' }]
              })(
                <AutoComplete
                  dataSource={currentWebsiteOptions}
                  onChange={setWebsite}
                  placeholder="website"
                >
                  <Input />
                </AutoComplete>
              )}
            </FormItem>
            <FormItem label="验证码" extra="请输入手机上接收到的验证码">
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('captcha', {
                    rules: [{ required: true, message: '请输入验证码' }]
                  })(<Input />)}
                </Col>
                <Col span={12}>
                  <Button>获取验证码</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...noLabelFormItemLayout}>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked'
              })(
                <Checkbox>
                  我已阅读 <a>agreement</a>
                </Checkbox>
              )}
            </FormItem>
            <FormItem {...noLabelFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Form.create()(RegistrationForm);
