import React from 'react'
import { Form, Input, Button, Checkbox,  Switch, Row, Col, InputNumber, Select } from 'antd';
import { Trans } from "@lingui/macro";
import { PlusOutlined, DeleteOutlined} from '@ant-design/icons'  
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

export const EnvConfigOne = () => {

    const [show,setShow] = React.useState(false);
    const [comps,setComps] = React.useState([{id:1,mode:1}])

    const addForm = ()=>{
        let arr:any = JSON.parse(JSON.stringify(comps))
        let id = random()
        arr.push({
            id:id,
            mode:'1'
        })
        setComps(arr)
    }

    const random = ()=>{
        let s = (Math.ceil(Math.random()*10000000)).toString()
        return s.substr(0,7)
    }

    const deleForm = (e:React.MouseEvent,id:any)=>{
        e.stopPropagation()
        let arr:any = JSON.parse(JSON.stringify(comps))
        console.log(arr,id)
        for(let i=0;i<arr.length;i++){
            if(arr[i]==id){
                arr.splice(i,1)
            }   
        }
        setComps(arr)
    }

    const renderForm = ()=>{
        console.log(comps)
    return comps.map((item:any,index:number)=> {
            return(<>
                <EnvConfigOneForm key={item.id}/>
                <Button className="env-config-del-btn" onClick={(e)=>deleForm(e,item.id)} size="small" shape="circle" danger icon={<DeleteOutlined translate/>} />
            </>)
        })
    }

    return (
        <>
            <div>{comps}</div>
            <Switch size="default" checked={show} onChange={()=>setShow(!show)}/> <Trans> Env Config One </Trans>
            <div style={{display:show?'block':'none'}}>
                <Button className="env-config-btn" shape="circle" icon={<PlusOutlined translate/>} onClick={()=>addForm()}/>
                {renderForm()}
            </div>
        </>
    );
}

export const EnvConfigOneForm = (id:any) => {

    const [mode,setMode] = React.useState("1")

    const onModeChange = (value:string) => {
        setMode(value)
    };

    const onFinish = (values:any) => {
        console.log('Success:', values);
    };
    
    const onFinishFailed = (errorInfo:any) => {
        console.log('Failed:', errorInfo);
    };

    const renderFormByType = ()=>{
        if(mode === '1'){
            return (
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Env Name</Trans>}
                            name="envName"
                            rules={[{ required: true, message: 'Please input ...!' }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Env Value</Trans>}
                            name="envValue"
                            rules={[{ required: true, message: 'Please input ...!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            )
        }
        else if(mode === '2'){
            return (
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Env Name</Trans>}
                            name="envName"
                            rules={[{ required: true, message: 'Please input ...!' }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Config Name</Trans>}
                            name="configName"
                            rules={[{ required: true, message: 'Please input ...!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={<Trans>Config Key</Trans>}
                            name="configKey"
                            rules={[{ required: true, message: 'Please input ...!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            )
        }else if(mode === '3'){
            return (
            <Row>
                <Col span={12}>
                    <Form.Item
                        label={<Trans>Env Name</Trans>}
                        name="envName"
                        rules={[{ required: true, message: 'Please input ...!' }]}
                    >
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={<Trans>Diction Name</Trans>}
                        name="dictionName"
                        rules={[{ required: true, message: 'Please input ...!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={<Trans>Diction Key</Trans>}
                        name="dictionkey"
                        rules={[{ required: true, message: 'Please input ...!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>)
        }else{
            return(
            <Row>
                <Col span={24}>
                    <Form.Item
                        {...maxLayout}
                        label={<Trans>Env Name</Trans>}
                        name="name"
                        rules={[{ required: true, message: 'Please input ...!' }]}
                    >
                        <Input/>
                    </Form.Item>
                </Col>
            </Row>)
        }
    }
    return(
        <> 
        <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mt-15"
        
        >
        <Row>
            <Col span={12}>
                <Form.Item
                    label={<Trans>Config One</Trans>}
                    name="mode"
                    rules={[{ required: true, message: 'Please input...!' }]}
                >
                    <Select
                        placeholder=""
                        onChange={(value)=>onModeChange(value)}
                        onClick={e => {e.stopPropagation()}}
                        defaultValue="1"
                    >
                        <Option value="1"><Trans>自定义环境变量</Trans></Option>
                        <Option value="2"><Trans>从配置集加载</Trans></Option>
                        <Option value="3"><Trans>从加密字典加载</Trans></Option>
                        <Option value="4"><Trans>其它</Trans></Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
        {renderFormByType()}
    </Form>
    </>
    )
}