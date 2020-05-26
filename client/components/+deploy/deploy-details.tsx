import "./deploy-details.scss";

import React from "react";
import { disposeOnUnmount, observer } from "mobx-react";
import { reaction } from "mobx";
import { AceEditor } from "../ace-editor";
import { Badge } from "../badge/badge";
import { Trans } from "@lingui/macro";
import { DrawerItem } from "../drawer";
import { deployStore } from "./deploy.store";
import { KubeObjectDetailsProps } from "../kube-object";
import { deployApi, Deploy } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";
<<<<<<< HEAD

=======
import { Stone } from "../../api/endpoints";
import {DetailForm} from './deploy-detail-form'
>>>>>>> deaf5d04745ea9047537f2c059d283f7971ab829

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
    if (!deploy) return null
    const object = deploy.getObject();
    return (
      <div className="DeployDetails">
        {/* <DetailForm/> */}
      </div>
    )
  }
}

apiManager.registerViews(deployApi, {
  Details: DeployDetails
})