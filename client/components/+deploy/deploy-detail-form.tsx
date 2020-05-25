import React from 'react'
import { Input, Button,Row,Col, Collapse,Select,Switch,InputNumber,Popconfirm  } from 'antd';
import { PlusOutlined,DeleteOutlined } from '@ant-design/icons';
import './deploy-detail-form.scss'
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
interface Props{

}

interface State{
  type:string,
  name:string,
  strategy:string,
  forms:Array<any>,
  activeKey?:any
}

export class DetailForm extends React.Component<Props,State>{
  
  constructor(props:any){
    super(props)
    this.state = {
      type:'',
      name:'',
      strategy:'',
      forms:[
        {
          id:1,
          name:'',
          image:'',
          strategy:'1',
          limitCpu:1,
          limitMemory:1,
          requireCpu:1,
          requireMemory:1,
          startCommand:[],
          startParams:[],
          oneEnvConfig:[
            {
              id:'1',
              type:'1',
              envConfigName:'', //环境变量名称
              envConfigValue:'', //环境变量值
              configSetName:'', //配置集Name
              configSetKey:'', //配置集Key
              encryptionName:'',//加密字典名称
              encryptionKey:'',//加密字典key
            }
          ],
          multipleEnvConfig:[],
          readyProbe:{
            status:false,
            timeout:'',
            cycle:'',
            retryCount:'',
            delay:'',
            pattern:{
              type:'1',
              httpPort:'',
              url:'',
              tcpPort:'',
              command:'333'
            }
          },
          aliveProbe:{
            status:false,
            timeout:'',
            cycle:'',
            retryCount:'',
            delay:'',
            pattern:{
              type:'1',
              httpPort:'',
              url:'',
              tcpPort:'',
              command:''
            }
          },
          lifeCycle:{
            status:false,
            postStart:{
              type:'1',
              httpPort:'',
              url:'',
              tcpPort:'',
              command:''
            },
            preStop:{
              type:'1',
              httpPort:'',
              url:'',
              tcpPort:'',
              command:''
            }
          }
        },
        {
          id:2,
          name:'',
          image:'',
          strategy:'',
          limitCpu:'',
          limitMemory:'',
          requireCpu:'',
          requireMemory:'',
          startCommand:[],
          startParams:[],
          oneEnvConfig:[],
          readyProbe:{
            status:false,
            timeout:'',
            cycle:'',
            retryCount:'',
            delay:'',
            pattern:{
              type:'1',
              httpPort:'',
              url:'',
              tcpPort:'',
              command:''
            }
          },
          aliveProbe:{
            status:false,
            timeout:'',
            cycle:'',
            retryCount:'',
            delay:'',
            pattern:{
              type:'1',
              httpPort:'',
              url:'',
              tcpPort:'',
              command:''
            }
          },
          lifeCycle:{
            status:false,
            postStart:{
              type:'1',
              httpPort:'',
              url:'',
              tcpPort:'',
              command:''
            },
            preStop:{
              type:'1',
              httpPort:'',
              url:'',
              tcpPort:'',
              command:''
            }
          }
        }
      ]
    }
  }

  changeSelectType(value:string){
    this.setState({type:value})
  }

  changeSelectStrategy(value:string){
    this.setState({strategy:value})
  }

  changeInputName(e:React.ChangeEvent<HTMLInputElement>){
    this.setState({name:e.target.value})
  }

  addContainer(){
    let {forms} = this.state
    const obj:any = {
      id:this.random(),
      name:'',
      image:'',
      strategy:'',
      limitCpu:'',
      limitMemory:'',
      requireCpu:'',
      requireMemory:'',
      startCommand:[],
      startParams:[],
      oneEnvConfig:[],
      readyProbe:{
        status:false,
        timeout:'',
        cycle:'',
        retryCount:'',
        delay:'',
        pattern:{
          type:'1',
          httpPort:'',
          url:'',
          tcpPort:'',
          command:''
        }
      },
      aliveProbe:{
        status:false,
        timeout:'',
        cycle:'',
        retryCount:'',
        delay:'',
        pattern:{
          type:'1',
          httpPort:'',
          url:'',
          tcpPort:'',
          command:''
        }
      },
      lifeCycle:{
        status:false,
        postStart:{
          type:'1',
          httpPort:'',
          url:'',
          tcpPort:'',
          command:''
        },
        preStop:{
          type:'1',
          httpPort:'',
          url:'',
          tcpPort:'',
          command:''
        }
      }
    }
    forms.push(obj)
    this.setState({forms:forms})
  }

  genExtra(index:number){
    let {forms} = this.state
    return(
      <Popconfirm
        title="确定删除吗?"
        onConfirm={(event:any) => {
          event.preventDefault()
          event.stopPropagation()
          forms.splice(index,1)
          this.setState({forms:forms})
        }}
        onCancel={(event:any) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        okText="Yes"
        cancelText="No">
          <DeleteOutlined translate style={{color:'#ff4d4f'}}
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
            }}
          />
    
      </Popconfirm>

    )
  };

  changeInputValue(index:number,e:React.ChangeEvent<HTMLInputElement>,filed:string){
    e.stopPropagation()
    let {forms} = this.state
    const value = e.target.value
    switch(filed){
        case 'name':
          forms[index].name = value
          break;
        case 'image':
          forms[index].image = value
          break;
    }
    this.setState({forms:forms})
  }
  
  random(){
    let s = (Math.ceil(Math.random()*10000000)).toString()
    return s.substr(0,7)
  }

  changeSelectValue(index:number,value:string,filed:string){
    let {forms} = this.state
    const val = value
    switch(filed){
        case 'strategy':
          forms[index].strategy = val
          break;
    }
    this.setState({forms:forms})
  }

  getData(){
    let obj = {...this.state}
    console.log(obj)
  }

  changeInputCpuAndMemory(index:number,value:any,filed:string){
    let {forms} = this.state
    const val = value
    switch(filed){
      case 'limitCpu':
        forms[index].limitCpu = val;
        break;
      case 'limitMemory':
        forms[index].limitMemory = val;
        break;
      case 'requireCpu':
        forms[index].requireCpu = val;
        break;
      case 'requireMemory':
        forms[index].requireMemory = val;
        break;
    }
    this.setState({forms:forms})
  }

  addStartCommand(index:number){
    let {forms} = this.state
    let obj = {
      id:this.random(),
      value:''
    }
    forms[index].startCommand.push(obj)
    this.setState({forms:forms})
  }

  changeInputStartCommand(index:number,scIndex:number,e:React.ChangeEvent<HTMLInputElement>){
    e.stopPropagation()
    let {forms} = this.state
    const value = e.target.value
    forms[index].startCommand[scIndex].value = value
    this.setState({forms:forms})
  }

  deleteStartCommand(index:number,id:string){
    let {forms} = this.state
    let com = forms[index].startCommand
    for(let i=0;i<com.length;i++){
      if(com[i].id == id){
        com.splice(i,1)
      }
    }
    this.setState({forms:forms})
  }

  addStartParams(index:number){
    let {forms} = this.state
    let obj = {
      id:this.random(),
      value:''
    }
    forms[index].startParams.push(obj)
    this.setState({forms:forms})
  }

  changeInputStartParams(index:number,scIndex:number,e:React.ChangeEvent<HTMLInputElement>){
    let {forms} = this.state
    const value = e.target.value
    forms[index].startParams[scIndex].value = value
    this.setState({forms:forms})
  }

  deleteStartParams(index:number,id:string){
    let {forms} = this.state
    let com = forms[index].startParams
    for(let i=0;i<com.length;i++){
      if(com[i].id == id){
        com.splice(i,1)
      }
    }
    this.setState({forms:forms})
  }

  addEnvConfigByOne(index:number){
    let {forms} = this.state
    let obj = {
      id:this.random(),
      type:'1',
      configName:'',
      configKey:'',
      configType:''
    }
    forms[index].oneEnvConfig.push(obj)
    this.setState({forms:forms})
  }

  deleteEnvConfigByOne(index:number,id:string){
    let {forms} = this.state
    let data = forms[index].oneEnvConfig
    for(let i=0;i<data.length;i++){
      if(data[i].id == id){
        data.splice(i,1)
      }
    }
    this.setState({forms:forms})
  }

  selectChangeEnvConfigByOne(index:number,cIndex:number,value:string){
    let {forms} = this.state
    const val = value
    forms[index].oneEnvConfig[cIndex].type = value
    this.setState({forms:forms})
  }

  inputChangeEnvConfigByOne(index:number,cIndex:number,e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>,filed:string){
    let {forms} = this.state
    const val = e.target.value
    let data = forms[index].oneEnvConfig[cIndex]
    switch(filed){
      case 'envConfigName':
        data.envConfigName = val
        break;
      case 'envConfigValue':
        data.envConfigValue = val
        break;
      case 'configSetName':
        data.configSetName = val
        break;  
      case 'configSetKey':
        data.configSetKey = val
        break; 
      case 'encryptionName':
        data.encryptionName = val
        break;
      case 'encryptionKey':
        data.encryptionKey = val
        break; 
    }
    this.setState({forms:forms})
  }

  switchChange(index:number,status:boolean,filed:string){
    let {forms} = this.state
    switch(filed){
      case 'readyProbe':
        forms[index].readyProbe.status = status
        break;
      case 'aliveProbe':
        forms[index].aliveProbe.status = status
        break;
      case 'lifeCycle':
        forms[index].lifeCycle.status = status
        break;  
    }
    this.setState({forms:forms})
  }

  readyProbeInputChange(index:number,e:string|any|React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>,filed:string){
    let {forms} = this.state
    let val = ''
    
    if(e&&e.target){
        console.log(e.target)
      val = e.target.value
    }
    else{
      val = e
    }
    let data = forms[index].readyProbe
    switch(filed){
      case 'timeout':
        data.timeout = val
        break;
      case 'cycle':
        data.cycle = val
        break;
      case 'retryCount':
        data.retryCount = val
        break;  
      case 'delay':
        data.delay = val
        break; 
      case 'httpPort':
        data.pattern.httpPort = val
        break;
      case 'url':
        data.pattern.url = val
      case 'tcpPort':
        data.pattern.tcpPort = val
        break;
      case 'command':
        data.pattern.command = val
        break; 
    }
    this.setState({forms:forms})
  }
  
  readyProbeSelectChange(index:number,value:string){
    let {forms} = this.state
    forms[index].readyProbe.pattern.type= value
    this.setState({forms:forms})
  }

  aliveProbeInputChange(index:number,e:string|any|React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>,filed:string){
    let {forms} = this.state
    let val = ''
    if(e&&e.target){
      val = e.target.value
    }
    else{
      val = e
    }
    let data = forms[index].aliveProbe
    switch(filed){
      case 'timeout':
        data.timeout = val
        break;
      case 'cycle':
        data.cycle = val
        break;
      case 'retryCount':
        data.retryCount = val
        break;  
      case 'delay':
        data.delay = val
        break; 
      case 'httpPort':
        data.pattern.httpPort = val
        break;
      case 'url':
        data.pattern.url = val
      case 'tcpPort':
        data.pattern.tcpPort = val
        break;
      case 'command':
        data.pattern.command = val
        break; 
    }
    this.setState({forms:forms})
  }
  
  aliveProbeSelectChange(index:number,value:string){
    let {forms} = this.state
    forms[index].aliveProbe.pattern.type= value
    this.setState({forms:forms})
  }

  lifeCycleInputChange(index:number,e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>,type:string,filed:string){
    let {forms} = this.state
    const val = e.target.value
    let data:any = {}
    if(type == 'postStart'){
        data = forms[index].lifeCycle.postStart
    }
    if(type == 'preStop'){
        data = forms[index].lifeCycle.preStop
    }
    switch(filed){
      case 'httpPort':
        data.httpPort = val
        break;
      case 'url':
        data.url = val
        break;
      case 'tcpPort':
        data.tcpPort = val
        break;
      case 'command':
        data.command = val
        break; 
    }
    this.setState({forms:forms})
  }
  
  lifeCycleSelectChange(index:number,value:string,filed:string){
    let {forms} = this.state
    switch(filed){
      case 'postStart':
        forms[index].lifeCycle.postStart.type= value
        break;
      case 'preStop':
        forms[index].lifeCycle.preStop.type= value
        break;
    }
    this.setState({forms:forms})
  }

  componentDidMount(){
    setTimeout(()=>{
      this.setState({
        activeKey:0
      })
    },1000)
   
  }

  render(){
    const {forms,type,name,strategy,activeKey} = this.state
    return(
      <>
        <Button onClick={()=>this.getData()}>获取数据</Button>
        <div className="top-form mt-10">
          <Row>
            <Col span={4} className="text-right fs-14 top-form-text">类型：</Col>
            <Col span={18}>
              <Select value={type} size="small" className="top-form-text" style={{width:'100%'}} onChange={(value)=>this.changeSelectType(value)} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
                <Option value="1" >IfNotPresent</Option>
                <Option value="2">Always</Option>
                <Option value="3">Never</Option>
              </Select>
            </Col>
          </Row>

          <Row className="mt-10">
            <Col span={4} className="text-right fs-14 top-form-text">名字：</Col>
            <Col span={18}>
              <Input size="small" className="top-form-text" value={name} onChange={(e)=>this.changeInputName(e)}/>
            </Col>
          </Row>

          <Row className="mt-10">
            <Col span={4} className="text-right fs-14 top-form-text">策略：</Col>
            <Col span={18}>
              <Select value={strategy} size="small" style={{width:'100%'}} className="top-form-text" onChange={(value)=>this.changeSelectStrategy(value)} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
                <Option value="1">IfNotPresent</Option>
                <Option value="2">Always</Option>
                <Option value="3">Never</Option>
              </Select>
            </Col>
          </Row>
        </div>
        <Button type="primary" className="mt-10" shape="circle" icon={<PlusOutlined translate/>} onClick={()=>this.addContainer()}></Button> <span className="btn-right-text3">添加容器</span>
        <Row className="mt-10"></Row>
        <Collapse defaultActiveKey={'0'} >
          {
            forms.map((item:any,index:number)=>{
              return (
                  <Panel header={`容器配置`} key={index} extra={this.genExtra(index)}>
                    <Row>
                      <Col span={4} className="text-right">容器名称：</Col>
                      <Col span={18}><Input size="small" value={forms[index].name} onChange={(e)=>this.changeInputValue(index,e,'name')}/></Col>
                    </Row>
                    <Row className="mt-10">
                      <Col span={4} className="text-right">镜像地址：</Col>
                      <Col span={18}>
                        <Input size="small" value={forms[index].image} onChange={(e)=>this.changeInputValue(index,e,'image')}/>
                      </Col>
                    </Row>
                    

                    <Row className="mt-10">
                      <Col span={4} className="text-right">镜像拉取策略：</Col>
                      <Col span={18}>
                        <Select value={forms[index].strategy} size="small" style={{width:'100%'}} onChange={(value)=>this.changeSelectValue(index,value,'strategy')} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
                          <Option value="1">IfNotPresent</Option>
                          <Option value="2">Always</Option>
                          <Option value="3">Never</Option>
                        </Select>
                      </Col>
                    </Row>

                    <Row className="mt-10">
                      <Col span={4} className="text-right">Limit CPU：</Col>
                      <Col span={6} className="text-right"><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="Limit CPU" value={forms[index].limitCpu} onChange={(e)=>this.changeInputCpuAndMemory(index,e,'limitCpu')}/></Col>
                      <Col span={2}></Col>
                      <Col span={5} className="text-right">Limit Memory：</Col>
                      <Col span={5} className="text-right"><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="Limit Memory" value={forms[index].limitMemory} onChange={(e)=>this.changeInputCpuAndMemory(index,e,'limitMemory')}/></Col>
                    </Row>

                    <Row className="mt-10">
                      <Col span={4} className="text-right">Require CPU：</Col>
                      <Col span={6} className="text-right"><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="Require CPU" value={forms[index].requireCpu} onChange={(e)=>this.changeInputCpuAndMemory(index,e,'requireCpu')}/></Col>
                      <Col span={2}></Col>
                      <Col span={5} className="text-right">Require Memory：</Col>
                      <Col span={5} className="text-right"><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="Require Memory" value={forms[index].requireMemory} onChange={(e)=>this.changeInputCpuAndMemory(index,e,'requireMemory')}/></Col>
                    </Row>

                    <Row><Button size="small" type="primary" className="mt-10" shape="circle" icon={<PlusOutlined translate/>} onClick={()=>this.addStartCommand(index)}></Button> <span className="btn-right-text1">添加启动命令</span> </Row>
                    {
                      forms[index].startCommand.map((item:any,scIndex:number)=>{
                        return(
                          <Row> 
                            <Col span={20} className="mt-10"><Input size="small" addonBefore="启动命令" value={forms[index].startCommand[scIndex].value} onChange={(e)=>this.changeInputStartCommand(index,scIndex,e)}/></Col>
                            <Col span={4} className="mt-10"><Button size="small" className="ml-10" icon={<DeleteOutlined translate/>} shape="circle" danger onClick={(e)=>{e.stopPropagation();this.deleteStartCommand(index,item.id)}}></Button></Col>
                          </Row> 
                        )
                      })
                    }

                    <Row><Button size="small" type="primary" className="mt-10" shape="circle" icon={<PlusOutlined translate/>} onClick={()=>this.addStartParams(index)}></Button> <span className="btn-right-text1">添加启动参数</span> </Row>
                    {
                      forms[index].startParams.map((item:any,scIndex:number)=>{
                        return(
                          <Row> 
                            <Col span={20} className="mt-10"><Input size="small" addonBefore="启动参数" value={forms[index].startParams[scIndex].value} onChange={(e)=>this.changeInputStartParams(index,scIndex,e)}/></Col>
                            <Col span={4} className="mt-10"><Button size="small" className="ml-10" icon={<DeleteOutlined translate/>} shape="circle" danger onClick={(e)=>{e.stopPropagation();this.deleteStartParams(index,item.id)}}></Button></Col>
                          </Row> 
                        )
                      })
                    }
                    <Row className="mt-10"><Button type="primary" size="small" shape="circle" icon={<PlusOutlined translate/>} onClick={()=>this.addEnvConfigByOne(index)}></Button><span className="btn-right-text2">环境变量配置（逐个加载）</span></Row>
                    {
                      forms[index].oneEnvConfig.map((item:any,cIndex:number)=>{
                        return(
                          <div className="env-config-block">
                            <Row className="mt-10">
                              <Col span={4} className="text-right">类型：</Col>
                              <Col span={18}>
                                <Select size="small" style={{width:'100%'}} value={item.type} onChange={(value)=>this.selectChangeEnvConfigByOne(index,cIndex,value)} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
                                  <Option value="1">自定义环境变量</Option>
                                  <Option value="2">从配置集加载</Option>
                                  <Option value="3">从加密字典加载</Option>
                                  <Option value="4">其它</Option>
                                </Select>
                              </Col>
                              <Button size="small" icon={<DeleteOutlined translate/>} className="ml-10" shape="circle" danger onClick={(e)=>{e.stopPropagation();this.deleteEnvConfigByOne(index,item.id)}}></Button>
                            </Row>
                            {
                              item.type=='1'?
                              <>
                              <Row className="mt-10">
                                <Col span={4} className="text-right">环境变量名称：</Col>
                                <Col span={18}><Input size="small" placeholder="环境变量名称" value={forms[index].oneEnvConfig[cIndex].envConfigValue} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'envConfigValue')}/></Col>
                              </Row>
                              <Row className="mt-10">
                                <Col span={4} className="text-right">环境变量值：</Col>
                                <Col span={18}><Input size="small" placeholder="环境变量值" value={forms[index].oneEnvConfig[cIndex].envConfigValue} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'envConfigValue')}/></Col>
                              </Row>
                              </>
                              :<></>
                            }
                            {
                              item.type=='2'?
                              <>
                              <Row className="mt-10">
                                <Col span={4} className="text-right">环境变量名称：</Col>
                                <Col span={18}><Input size="small" placeholder="环境变量名称" value={forms[index].oneEnvConfig[cIndex].envConfigName} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'envConfigName')}/></Col>
                              </Row>
                              <Row className="mt-10">
                                <Col span={4} className="text-right">配置集名称：</Col>
                                <Col span={18}><Input size="small" placeholder="配置集名称" value={forms[index].oneEnvConfig[cIndex].configSetName} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'configSetName')}/></Col>
                              </Row>
                              <Row className="mt-10">
                                <Col span={4} className="text-right">配置集Key：</Col>
                                <Col span={18}><Input size="small" placeholder="配置集Key" value={forms[index].oneEnvConfig[cIndex].configSetKey} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'configSetKey')}/></Col>
                              </Row>
                              </>
                              :<></>
                            }
                            {
                              item.type=='3'?
                              <>
                              <Row className="mt-10">
                                <Col span={4} className="text-right">环境变量名称：</Col>
                                <Col span={18}><Input size="small" placeholder="环境变量名称" value={forms[index].oneEnvConfig[cIndex].envConfigName} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'envConfigName')}/></Col>
                              </Row>
                              <Row className="mt-10">
                                <Col span={4} className="text-right">加密字典名称：</Col>
                                <Col span={18}><Input size="small" placeholder="加密字典名称" value={forms[index].oneEnvConfig[cIndex].encryptionName} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'encryptionName')}/></Col>
                              </Row>
                              <Row className="mt-10">
                               <Col span={4} className="text-right">加密字典Key：</Col>
                                <Col span={18}><Input size="small" placeholder="加密字典Key" value={forms[index].oneEnvConfig[cIndex].encryptionKey} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'encryptionKey')}/></Col>
                              </Row>
                              </>
                              :<></>
                            }
                            {
                              item.type=='4'?
                              <Row className="mt-10">
                                <Col span={4} className="text-right">输入命令：</Col>
                                <Col span={18}><TextArea rows={4} placeholder="输入命令" value={forms[index].oneEnvConfig[cIndex].envConfigName} onChange={(e)=>this.inputChangeEnvConfigByOne(index,cIndex,e,'envConfigName')}/></Col>
                              </Row>
                              :<></>
                            }
                          </div> 
                        )
                      })
                    }
                    <Row>
                      <Switch size="small" style={{marginTop:'13px'}} checked={forms[index].readyProbe.status} onChange={(e)=>this.switchChange(index,e,'readyProbe')} /><span className="btn-right-text1">就绪探针（建议开启）</span>
                    </Row>
                    {
                      forms[index].readyProbe.status === true?
                      <div className="ready-probe-block">
                      <Row className="mt-10">
                        <Col span={4} className="text-right">超时时间：</Col>
                        <Col span={6}><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="超时时间" value={forms[index].readyProbe.timeout} onChange={(e)=>this.readyProbeInputChange(index,e,'timeout')}/></Col>
                        <Col span={1}></Col>
                        <Col span={4} className="text-right">探测周期：</Col>
                        <Col span={6}><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="探测周期" value={forms[index].readyProbe.cycle} onChange={(e)=>this.readyProbeInputChange(index,e,'cycle')}/></Col>
                      </Row>
                      <Row className="mt-10">
                        <Col span={4} className="text-right">失败重试次数：</Col>
                        <Col span={6}><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="失败重试次数" value={forms[index].readyProbe.retryCount} onChange={(e)=>this.readyProbeInputChange(index,e,'retryCount')}/></Col>
                        <Col span={1}></Col>
                        <Col span={4} className="text-right">探测延迟：</Col>
                        <Col span={6}><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="探测延迟" value={forms[index].readyProbe.delay} onChange={(e)=>this.readyProbeInputChange(index,e,'delay')}/></Col>
                      </Row>
                      <Row className="mt-10">
                          <Col span={4} className="text-right">探测方式：</Col>
                          <Col span={6}>
                          <Select size="small" style={{width:'100%'}} value={forms[index].readyProbe.pattern.type} onChange={(value)=>this.readyProbeSelectChange(index,value)} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
                            <Option value="1">HTTP请求</Option>
                            <Option value="2">TCP端口</Option>
                            <Option value="3">执行命令</Option>
                          </Select>
                          </Col>
                      </Row>
                      {
                        forms[index].readyProbe.pattern.type=='1'?
                        <Row className="mt-10">
                          <Col span={4} className="text-right">HTTP端口：</Col>
                          <Col span={6}><Input size="small" placeholder="HTTP端口" value={forms[index].readyProbe.pattern.httpPort} onChange={(e)=>this.readyProbeInputChange(index,e,'httpPort')}/></Col>
                          <Col span={1}></Col>
                          <Col span={4} className="text-right">URL：</Col>
                          <Col span={6}><Input size="small" placeholder="URL" value={forms[index].readyProbe.pattern.url} onChange={(e)=>this.readyProbeInputChange(index,e,'url')}/></Col>
                        </Row>
                        :<></>
                      }
                      {
                        forms[index].readyProbe.pattern.type=='2'?
                        <Row className="mt-10">
                          <Col span={4} className="text-right">TCP端口：</Col>
                          <Col span={6}><Input size="small" placeholder="TCP端口" value={forms[index].readyProbe.pattern.tcpPort} onChange={(e)=>this.readyProbeInputChange(index,e,'tcpPort')}/></Col>
                        </Row>
                        :<></>
                      }
                      {
                        forms[index].readyProbe.pattern.type=='3'?
                        <Row className="mt-10">
                          <Col span={4} className="text-right">执行命令：</Col>
                          <Col span={18}><TextArea rows={4} placeholder="执行命令" value={forms[index].readyProbe.pattern.command} onChange={(e)=>this.readyProbeInputChange(index,e,'command')}/></Col>
                        </Row>
                        :<></>
                      }
                      </div>
                      :<></>
                    }


                    <Row>
                      <Switch size="small" style={{marginTop:'13px'}} checked={forms[index].aliveProbe.status} onChange={(e)=>this.switchChange(index,e,'aliveProbe')} /><span className="btn-right-text1">存活探针</span>
                    </Row>
                    {
                      forms[index].aliveProbe.status === true?
                      <div className="ready-probe-block">
                      <Row className="mt-10">
                        <Col span={4} className="text-right">超时时间：</Col>
                        <Col span={6}><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="超时时间" value={forms[index].aliveProbe.timeout} onChange={(e)=>this.aliveProbeInputChange(index,e,'timeout')}/></Col>
                        <Col span={1}></Col>
                        <Col span={4} className="text-right">探测周期：</Col>
                        <Col span={6}><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="探测周期" value={forms[index].aliveProbe.cycle} onChange={(e)=>this.aliveProbeInputChange(index,e,'cycle')}/></Col>
                      </Row>
                      <Row className="mt-10">
                        <Col span={4} className="text-right">失败重试次数：</Col>
                        <Col span={6}><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="失败重试次数" value={forms[index].aliveProbe.retryCount} onChange={(e)=>this.aliveProbeInputChange(index,e,'retryCount')}/></Col>
                        <Col span={1}></Col>
                        <Col span={4} className="text-right">探测延迟：</Col>
                        <Col span={6}><InputNumber min={0} style={{width:'100%'}} size="small" placeholder="探测延迟" value={forms[index].aliveProbe.delay} onChange={(e)=>this.aliveProbeInputChange(index,e,'delay')}/></Col>
                      </Row>
                      <Row className="mt-10">
                          <Col span={4} className="text-right">探测方式：</Col>
                          <Col span={6}>
                          <Select size="small" style={{width:'100%'}} value={forms[index].aliveProbe.pattern.type} onChange={(value)=>this.aliveProbeSelectChange(index,value)} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
                            <Option value="1">HTTP请求</Option>
                            <Option value="2">TCP端口</Option>
                            <Option value="3">执行命令</Option>
                          </Select>
                          </Col>
                      </Row>
                      {
                        forms[index].aliveProbe.pattern.type=='1'?
                        <Row className="mt-10">
                          <Col span={4} className="text-right">HTTP端口：</Col>
                          <Col span={6}><Input size="small" placeholder="HTTP端口" value={forms[index].aliveProbe.pattern.httpPort} onChange={(e)=>this.aliveProbeInputChange(index,e,'httpPort')}/></Col>
                          <Col span={1}></Col>
                          <Col span={4} className="text-right">URL：</Col>
                          <Col span={6}><Input size="small" placeholder="URL" value={forms[index].aliveProbe.pattern.url} onChange={(e)=>this.aliveProbeInputChange(index,e,'url')}/></Col>
                        </Row>
                        :<></>
                      }
                      {
                        forms[index].aliveProbe.pattern.type=='2'?
                        <Row className="mt-10">
                          <Col span={4} className="text-right">TCP端口：</Col>
                          <Col span={6}><Input size="small" placeholder="TCP端口" value={forms[index].aliveProbe.pattern.tcpPort} onChange={(e)=>this.aliveProbeInputChange(index,e,'tcpPort')}/></Col>
                        </Row>
                        :<></>
                      }
                      {
                        forms[index].aliveProbe.pattern.type=='3'?
                        <Row className="mt-10">
                          <Col span={4} className="text-right">执行命令：</Col>
                          <Col span={18}><TextArea rows={4} placeholder="执行命令" value={forms[index].aliveProbe.pattern.command} onChange={(e)=>this.aliveProbeInputChange(index,e,'command')}/></Col>
                        </Row>
                        :<></>
                      }
                      </div>
                      :<></>
                    }

                    <Row>
                      <Switch size="small" style={{marginTop:'13px'}} checked={forms[index].lifeCycle.status} onChange={(e)=>this.switchChange(index,e,'lifeCycle')} /><span className="btn-right-text1">生命周期</span>
                    </Row>
                    {
                      forms[index].lifeCycle.status === true?
                      <div className="ready-probe-block">
                        <Row className="mt-10">
                            <Col span={4} className="text-right">postStart：</Col>
                            <Col span={6}>
                              <Select size="small" style={{width:'100%'}} value={forms[index].lifeCycle.postStart.type} onChange={(value)=>this.lifeCycleSelectChange(index,value,'postStart')} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
                                <Option value="1">不启用</Option>
                                <Option value="2">HTTP请求</Option>
                                <Option value="3">TCP请求</Option>
                                <Option value="4">执行命令</Option>
                              </Select>
                            </Col>
                        </Row>
                      
                        {
                          forms[index].lifeCycle.postStart.type=='2'?
                          <Row className="mt-10">
                            <Col span={4} className="text-right">HTTP端口：</Col>
                            <Col span={6}><Input size="small" placeholder="HTTP端口" value={forms[index].lifeCycle.postStart.httpPort} onChange={(e)=>this.lifeCycleInputChange(index,e,'postStart','httpPort')}/></Col>
                            <Col span={1}></Col>
                            <Col span={4} className="text-right">URL：</Col>
                            <Col span={6}><Input size="small" placeholder="URL" value={forms[index].lifeCycle.postStart.url} onChange={(e)=>this.lifeCycleInputChange(index,e,'postStart','url')}/></Col>
                          </Row>
                          :<></>
                        }
                        {
                          forms[index].lifeCycle.postStart.type=='3'?
                          <Row className="mt-10">
                            <Col span={4} className="text-right">TCP端口：</Col>
                            <Col span={6}><Input size="small" placeholder="TCP端口" value={forms[index].lifeCycle.postStart.tcpPort} onChange={(e)=>this.lifeCycleInputChange(index,e,'postStart','tcpPort')}/></Col>
                          </Row>
                          :<></>
                        }
                        {
                          forms[index].lifeCycle.postStart.type=='4'?
                          <Row className="mt-10">
                            <Col span={4} className="text-right">执行命令：</Col>
                            <Col span={18}><TextArea rows={4} placeholder="执行命令" value={forms[index].lifeCycle.postStart.command} onChange={(e)=>this.lifeCycleInputChange(index,e,'postStart','command')}/></Col>
                          </Row>
                          :<></>
                        }

                        <Row className="mt-10">
                            <Col span={4} className="text-right">preStop：</Col>
                            <Col span={6}>
                              <Select size="small" style={{width:'100%'}} value={forms[index].lifeCycle.preStop.type} onChange={(value)=>this.lifeCycleSelectChange(index,value,'preStop')} onClick={(e:React.MouseEvent)=>e.stopPropagation()}>
                                <Option value="1">不启用</Option>
                                <Option value="2">HTTP请求</Option>
                                <Option value="3">TCP请求</Option>
                                <Option value="4">执行命令</Option>
                                <Option value="5">安全退出</Option>
                              </Select>
                            </Col>
                        </Row>
                        {
                          forms[index].lifeCycle.preStop.type=='2'?
                          <Row className="mt-10">
                            <Col span={4} className="text-right">HTTP端口：</Col>
                            <Col span={6}><Input size="small" placeholder="HTTP端口" value={forms[index].lifeCycle.preStop.httpPort} onChange={(e)=>this.lifeCycleInputChange(index,e,'preStop','httpPort')}/></Col>
                            <Col span={1}></Col>
                            <Col span={4} className="text-right">URL：</Col>
                            <Col span={6}><Input size="small" placeholder="URL" value={forms[index].lifeCycle.preStop.url} onChange={(e)=>this.lifeCycleInputChange(index,e,'preStop','url')}/></Col>
                          </Row>
                          :<></>
                        }
                        {
                          forms[index].lifeCycle.preStop.type=='3'?
                          <Row className="mt-10">
                            <Col span={4} className="text-right">TCP端口：</Col>
                            <Col span={6}><Input size="small" placeholder="TCP端口" value={forms[index].lifeCycle.preStop.tcpPort} onChange={(e)=>this.lifeCycleInputChange(index,e,'preStop','tcpPort')}/></Col>
                          </Row>
                          :<></>
                        }
                        {
                          forms[index].lifeCycle.preStop.type=='4'?
                          <Row className="mt-10">
                            <Col span={4} className="text-right">执行命令：</Col>
                            <Col span={18}><TextArea rows={4} placeholder="执行命令" value={forms[index].lifeCycle.preStop.command} onChange={(e)=>this.lifeCycleInputChange(index,e,'preStop','command')}/></Col>
                          </Row>
                          :<></>

                        }
                      </div>
                      :<></>
                    }
                  </Panel>
              )
            })
          }
        </Collapse>
        
      </>
    )
  }
}