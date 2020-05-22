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
    const object = deploy.getObject();
    return (
      <div className="DeployDetails">
        <DrawerItem name={<Trans>App Name</Trans>} labelsOnly>
          {
            <>{deploy.getAppName()}</>
          }
        </DrawerItem>

        <DrawerItem name={<Trans>Template Content</Trans>} labelsOnly>
          <AceEditor
            mode="yaml"
            value={JSON.stringify(object)}
            showGutter={false}
            readOnly
          />
        </DrawerItem>

      </div>
    )
  }
}

apiManager.registerViews(deployApi, {
  Details: DeployDetails
})