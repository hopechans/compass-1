import React from 'react'
import { Form, Input, Button, Checkbox,  Switch, Row, Col, InputNumber, Select } from 'antd';
import { Trans } from "@lingui/macro";
import './deploy-details.scss'
const { Option } = Select;
const { TextArea } = Input;
const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
};


const maxLayout = {
    labelCol: {
      span: 5 
    },
    wrapperCol: {
        span: 15
    },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const PreProbe = () => {

    const [show,setShow] = React.useState(false)
    const [mode,setMode] = React.useState('http')

    const onProbeModeChange = (value:string) => {
        setMode(value)
    };

    const onFinish = (values:any) => {
        console.log('Success:', values);
    };
    
    const onFinishFailed = (errorInfo:any) => {
        console.log('Failed:', errorInfo);
    };

    const renderFormByType = ()=>{
        if(mode === 'http'){
            return (
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>HTTP Port</Trans>}
                            name="httpPort"
                            rules={[{ required: true, message: 'Please input your port!' }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>HTTP URL</Trans>}
                            name="httpUrl"
                            rules={[{ required: true, message: 'Please input your url!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            )
        }
        else if(mode === 'tcp'){
            return (<Row>
                <Col span={12}>
                    <Form.Item
                        label={<Trans>TCP Port</Trans>}
                        name="tcpPort"
                        rules={[{ required: true, message: 'Please input your port!' }]}
                    >
                        <Input/>
                    </Form.Item>
                </Col>
            </Row>)
        }else{
            return(
            <Row>
                <Col span={24}>
                    <Form.Item
                        {...maxLayout}
                        label={<Trans>Execute Command</Trans>}
                        name="command"
                        rules={[{ required: true, message: 'Please input your execute command!' }]}
                    >
                        <TextArea rows={4}/>
                    </Form.Item>
                </Col>
            </Row>)
        }
    }

    
    return (
        <>
            <Switch size="default" checked={show} onChange={()=>setShow(!show)}/> <Trans> Ready Probe  ( Recommended on )</Trans>
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="mt-15"
                style={{display:show?'block':'none'}}
                >
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Timeout</Trans>}
                            name="timeout"
                            rules={[{ required: true, message: 'Please input your timeout!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Period</Trans>}
                            name="period"
                            rules={[{ required: true, message: 'Please input your period!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Failed Retries</Trans>}
                            name="retries"
                            rules={[{ required: true, message: 'Please input your retries!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Delay</Trans>}
                            name="delay"
                            rules={[{ required: true, message: 'Please input your delay!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Probe Mode</Trans>}
                            name="mode"
                            rules={[{ required: true, message: 'Please input your retries!' }]}
                        >
                            <Select
                                placeholder=""
                                onChange={(value)=>onProbeModeChange(value)}
                                onClick={e => {e.stopPropagation()}}
                                defaultValue="http"
                            >
                                <Option value="http"><Trans>HTTP Request</Trans></Option>
                                <Option value="tcp"><Trans>TCP Port</Trans></Option>
                                <Option value="command"><Trans>Execute Command</Trans></Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {renderFormByType()}
            </Form>
        </>
    );
}