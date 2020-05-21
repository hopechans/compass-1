import React from 'react'
import { Form, Input, Button, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Trans } from "@lingui/macro";
const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

export class DeployBaseForm extends React.Component {
  formRef = React.createRef<FormInstance>();

  onGenderChange = (e:any) => {
    e.stopPropagation()
      console.log(e)
    // this.formRef.current.setFieldsValue({
    //   note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    // });
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
      <Form {...layout} ref={this.formRef} name="control-ref" size="small" onFinish={this.onFinish}>
        <Form.Item name="type" label={<Trans>Type</Trans>} rules={[{ required: true }]}>
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
        <Form.Item name="name" label={<Trans>Name</Trans>} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="gender" label={<Trans>Strategy</Trans>} rules={[{ required: true }]}>
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
      </Form>
    );
    }
}