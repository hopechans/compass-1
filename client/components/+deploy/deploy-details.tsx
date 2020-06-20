import "./config-copy-deploy-dialog.scss"

import React, { ReactElement } from "react";
import { observer, disposeOnUnmount } from "mobx-react";
import { Dialog, DialogProps } from "../dialog";
import { computed, observable, autorun } from "mobx";
import { number, t, Trans } from "@lingui/macro";
import { Wizard, WizardStep } from "../wizard";
import { base, Container, container, MultiContainerDetails } from "../+deploy-container";
import { Collapse } from "antd";
import { deployService, DeployServiceDetails, Service } from "../+deploy-service";
import { MultiVolumeClaimDetails, VolumeClaimTemplate } from "../+deploy-volumeclaim-dialog";
import { app, App } from "../+deploy-app";
import { AppDetails } from "../+deploy-app";
import { Notifications } from "../notifications";
import { Deploy, deployApi } from "../../api/endpoints"
import { apiManager } from "client/api/api-manager";
import { KubeObjectMeta } from "../kube-object/kube-object-meta";
import { KubeObjectDetailsProps } from "../kube-object";
import { KubeEventDetails } from "../+events/kube-event-details";
import { Button } from "../button/button";

const { Panel } = Collapse;

interface Props extends KubeObjectDetailsProps<Deploy> {
}

@observer
export class DeployDetails extends React.Component<Props> {
  @observable isSaving = false;
  @observable data: Deploy;
  @observable app: App = app;
  @observable service: Service = deployService;
  @observable containers: Container[] = [container];
  @observable volumeClaims: VolumeClaimTemplate[] = [];


  async componentDidMount() {
    disposeOnUnmount(this, [
      autorun(() => {
        const { object: deploy } = this.props;
        console.log("xxxx", deploy)
        if (deploy) {
          this.data = deploy; // refresh
          this.app = {
            name: deploy.spec.appName,
            type: deploy.spec.resourceType
          };
          this.containers = JSON.parse(deploy.spec.metadata);
          this.service = JSON.parse(deploy.spec.service);
          this.volumeClaims = JSON.parse(deploy.spec.volumeClaims);
        }
      }),
    ])
  }

  save = async () => {
    this.isSaving = true;
    const { app, containers, service, volumeClaims } = this;
    const deploy: Partial<Deploy> = {
      spec: {
        appName: app.name,
        resourceType: app.type,
        metadata: JSON.stringify(containers),
        service: JSON.stringify(service),
        volumeClaims: JSON.stringify(volumeClaims),
      }
    }
    try {
      await deployApi.create({
        namespace: '',
        name: this.data.metadata.name
      },
        { ...deploy });
      Notifications.ok(
        <p>
          <Trans>Deploy <b>{deploy.getName()}</b> successfully updated.</Trans>
        </p>
      );
    } finally {
      this.isSaving = false;
    }
  }

  render() {
    const { object: deploy } = this.props;
    const { app, containers, service, volumeClaims } = this;
    console.log("render", deploy)
    return (
      <div className="DeployDetails">
        <KubeObjectMeta object={deploy} />
        <Button
          primary
          label={<Trans>Save</Trans>} waiting={this.isSaving}
          className="save-btn"
          onClick={this.save}
        />
        <KubeEventDetails object={deploy} />
      </div>
    )
  }
}


apiManager.registerViews(deployApi, {
  Details: DeployDetails,
})
