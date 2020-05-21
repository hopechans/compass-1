import "./deploy-details.scss";

import React from "react";
import { disposeOnUnmount, observer } from "mobx-react";
import { reaction } from "mobx";
import { Badge } from "../badge/badge";
import { Trans } from "@lingui/macro";
import { DrawerItem } from "../drawer";
import { deployStore } from "./deploy.store";
import { KubeObjectDetailsProps } from "../kube-object";
import { deployApi, Deploy } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";
import { Collapse,Button} from 'antd'
import { DeployBaseForm } from './deploy-detail-base-form'
import { DeployContainerForm } from './deploy-detail-container-form'
import { PlusOutlined } from '@ant-design/icons'  
interface Props extends KubeObjectDetailsProps<Deploy> {
}

@observer
export class DeployDetails extends React.Component<Props> {

  baseFormRef = React.createRef<any>()

  @disposeOnUnmount
  clean = reaction(() => this.props.object, () => {
    deployStore.reset();
  });

  getData(){
    this.baseFormRef.current.getData().then((values:any)=>{
      console.log(values)
    });
   
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    deployStore.reset();
  }

  render() {
    const { object: deploy } = this.props;
    const { Panel } = Collapse;
    if (!deploy) return null
    return (
      <div className="DeployDetails">
          <Button onClick={()=>this.getData()}>Data</Button>
          <Button type="primary" htmlType="submit">
              Submit
          </Button>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            className="site-collapse-custom-collapse"
          >
            <Panel header={<Trans>Base Information</Trans>} key="1" className="site-collapse-custom-panel">
              <DeployBaseForm ref={this.baseFormRef}></DeployBaseForm>
            </Panel>
          </Collapse>
          <Button type="primary" shape="circle" icon={<PlusOutlined translate/>} />
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            className="site-collapse-custom-collapse"
          >
            <Panel header={<Trans>Container Config</Trans>} key="1" className="site-collapse-custom-panel">
              <DeployContainerForm ref={this.baseFormRef}></DeployContainerForm>
            </Panel>
            
          </Collapse>
      </div>
    )
  }
}

apiManager.registerViews(deployApi, {
  Details: DeployDetails
})