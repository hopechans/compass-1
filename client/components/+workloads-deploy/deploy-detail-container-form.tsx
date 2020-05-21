import React from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select, Row, Col, InputNumber  } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Trans } from "@lingui/macro";
import { PreProbe } from './deploy-detail-probe-ready'
import { AliveProbe } from './deploy-detail-probe-alive'
import { LifeCycle } from './deploy-detial-life-cycle'
import { EnvConfigOne } from './deploy-detail-env-config-one'

import './deploy-details.scss'
const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

const itemLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
}

const startCommandItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    },
  };
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 15, offset: 6 },
    },
};


export class DeployContainerForm extends React.Component {
  formRef = React.createRef<FormInstance>();

  onGenderChange = (e:any) => {
  };

  onFinish = (values:any) => {
    console.log(values);
  };

  getData(){
    return this.formRef.current.validateFields()
  }

  onReset = () => {
    this.formRef.current.resetFields();
  };

  onFill = () => {
    this.formRef.current.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  render() {
    return (
      <>
        <Form {...layout} ref={this.formRef} name="control-ref" size="small" onFinish={this.onFinish}>

        <Form.Item name="name" label={<Trans>Name</Trans>} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="image" label={<Trans>Image</Trans>} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="imagePullPolicy" label={<Trans>Image Pull Policy</Trans>} rules={[{ required: true }]}>
          <Select
            placeholder=""
            onChange={this.onGenderChange}
            onClick={e => {e.stopPropagation()}}
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>

        <Row>
            <Col span={12}>
                <Form.Item {...itemLayout} name="limitcpu" label={<Trans>Limit CPU</Trans>} rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item {...itemLayout} name="limitmemory" label={<Trans>Limit Memory</Trans>} rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
            </Col>
        </Row>
        
        <Row>
            <Col span={12}>
                <Form.Item {...itemLayout} name="requestscpu" label={<Trans>Requests CPU</Trans>} rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item {...itemLayout} name="requestsmemory" label={<Trans>Requests Memory</Trans>} rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>
            </Col>
        </Row>
        
        <Form.List name="names1">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? 'Start Command' : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please input Start Command.",
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="Start Command" style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                        translate
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={(e) => {
                          e.stopPropagation()
                        remove(field.name);
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item {...startCommandItemLayout} name="StartCommand" label={<Trans>Add Start Command</Trans>}>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined translate/>Add Start Command
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
      
      <Form.List name="names2">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? 'Start Params' : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please input Start Params.",
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="Start Params" style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                        translate
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={(e) => {
                          e.stopPropagation()
                        remove(field.name);
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item {...startCommandItemLayout} name="StartParams" label={<Trans>Add Start Params</Trans>}>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined translate/>Add Start Params
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
        <div className="mt-15"><EnvConfigOne/></div>
        <div className="mt-15"><PreProbe /></div>
        <div className="mt-15"><AliveProbe/></div>
        <div className="mt-15"><LifeCycle/></div>
      </Form>
      </>
    );
    }
}