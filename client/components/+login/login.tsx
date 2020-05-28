import React from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons';


import { Form, Input, Button, Checkbox,message } from 'antd';
import './login.scss'
const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

interface Props{
  history:any
}

interface State{
  loading:boolean
}

export class Login extends React.Component<Props,State>{

   constructor(props:Props){
      super(props)
      this.state={
        loading:false
      }
   }

   onFinish = (values:any) => {
    console.log('Success:', values);
    this.setState({loading:true})
    setTimeout(()=>{
      this.props.history.push("/cluster");
      message.success('登录成功');
      this.setState({loading:false})
    },1500)

  };

   onFinishFailed = (errorInfo:any) => {
    console.log('Failed:', errorInfo);
  };


  render(){
    return (
      <div className="login-main">
        <div className="login-header">
            <div className="login-title">
                <img src={require("../../favicon/compass.png")}/>
                <div className="text">Compass</div>
            </div>
            <div className="login-sub-title">容器云平台</div>  
           
        </div>
        <div className="login-content">
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input prefix={<UserOutlined translate className="site-form-item-icon" />} placeholder="username"/>
            </Form.Item>
  
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="password" prefix={<LockOutlined translate className="site-form-item-icon"/>} />
            </Form.Item>
  
            {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}
  
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" className="login-btn-submit" loading={this.state.loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="footer">
        </div>
      </div>
    );
  }
}

