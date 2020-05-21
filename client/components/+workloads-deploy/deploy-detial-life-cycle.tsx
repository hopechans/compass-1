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

export const LifeCycle = () => {

    const [show,setShow] = React.useState(false)
    const [postStart,setPostStart] = React.useState('disable')
    const [preStop,setPreStop] = React.useState('disable')

    const onPostStartModeChange = (value:string) => {
        setPostStart(value)
    };

    const onPostStopModeChange = (value:string) => {
        setPreStop(value)
    };

    const onFinish = (values:any) => {
        console.log('Success:', values);
    };
    
    const onFinishFailed = (errorInfo:any) => {
        console.log('Failed:', errorInfo);
    };

    const renderPostStartFormByType = ()=>{
        if(postStart === 'http'){
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
        else if(postStart === 'tcp'){
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
        }else if(postStart === 'command'){
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
        }else if(postStart === 'disable'){
            return (<></>)
        }else if(postStart === 'exit'){
            return (<></>)
        }
    }

    const renderPostStopFormByType = ()=>{
        if(preStop === 'http'){
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
        else if(preStop === 'tcp'){
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
        }else if(preStop === 'command'){
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
        }else if(preStop === 'disable'){
            return (<></>)
        }
    }
    return (
        <>
            <Switch size="default" checked={show} onChange={()=>setShow(!show)}/> <Trans> Life Cycle </Trans>
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
                            label={<Trans>postStart</Trans>}
                            name="postStart"
                            rules={[{ required: false, message: 'Please input ...' }]}
                        >
                            <Select
                                placeholder=""
                                onChange={(value)=>onPostStartModeChange(value)}
                                onClick={e => {e.stopPropagation()}}
                                defaultValue="disable"
                            >
                                <Option value="disable"><Trans>Disable</Trans></Option>
                                <Option value="http"><Trans>HTTP Request</Trans></Option>
                                <Option value="tcp"><Trans>TCP Port</Trans></Option>
                                <Option value="command"><Trans>Execute Command</Trans></Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {renderPostStartFormByType()}
            
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>preStop</Trans>}
                            name="preStop"
                            rules={[{ required: false, message: 'Please input ...!' }]}
                        >
                            <Select
                                placeholder=""
                                onChange={(value)=>onPostStopModeChange(value)}
                                onClick={e => {e.stopPropagation()}}
                                defaultValue="disable"
                            >
                                <Option value="disable"><Trans>Disable</Trans></Option>
                                <Option value="http"><Trans>HTTP Request</Trans></Option>
                                <Option value="tcp"><Trans>TCP Port</Trans></Option>
                                <Option value="command"><Trans>Execute Command</Trans></Option>
                                <Option value="exit"><Trans>Safe Exit</Trans></Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {renderPostStopFormByType()}

            </Form>    
        </>
    );
}