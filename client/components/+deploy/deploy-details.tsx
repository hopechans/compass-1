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
import { Stone } from "../../api/endpoints";

interface Props extends KubeObjectDetailsProps<Deploy> {
}

@observer
export class DeployDetails extends React.Component<Props> {
  @disposeOnUnmount
  clean = reaction(() => this.props.object, () => {
    deployStore.reset();
  });

  componentDidMount() {
  }

  componentWillUnmount() {
    deployStore.reset();
  }

  render() {
    const { object: deploy } = this.props;
    if (!deploy) return null
    const tmplate = deploy.getTemplate();
    return (
      <div className="DeployDetails">
        12345 上山打老虎
        
      </div>
    )
  }
}

apiManager.registerViews(deployApi, {
  Details: DeployDetails
})