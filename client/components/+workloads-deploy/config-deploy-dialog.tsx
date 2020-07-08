import "./config-deploy-dialog.scss"

import React, { ReactElement } from "react";
import { observer } from "mobx-react";
import { Dialog, DialogProps } from "../dialog";
import { observable } from "mobx";
import { Trans } from "@lingui/macro";
import { Wizard, WizardStep } from "../wizard";
import { Container, container, MultiContainerDetails } from "../+deploy-container";
import { Collapse } from "../collapse";
import { deployService, DeployServiceDetails, Service } from "../+deploy-service";
import { MultiVolumeClaimDetails, VolumeClaimTemplate } from "../+deploy-volumeclaim";
import { app, App } from "../+deploy-app";
import { AppDetails } from "../+deploy-app";
import { deployStore } from "./deploy.store";
import { Notifications } from "../notifications";
import { Deploy } from "../../api/endpoints";

interface Props extends DialogProps {

}

@observer
export class ConfigDeployDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static Data: Deploy = null;
  @observable app: App = app;
  @observable service: Service = deployService;
  @observable containers: Container[] = [container];
  @observable volumeClaims: VolumeClaimTemplate[] = [];

  static open(object: Deploy) {
    ConfigDeployDialog.isOpen = true;
    ConfigDeployDialog.Data = object;
  }

  get deploy() {
    return ConfigDeployDialog.Data
  }

  static close() {
    ConfigDeployDialog.isOpen = false;
  }

  close = () => {
    ConfigDeployDialog.close();
  }

  reset = () => {
    this.app = app;
    this.service = deployService;
    this.containers = [container];
    this.volumeClaims = [];
  }

  onOpen = () => {
    this.app = {
      name: this.deploy.spec.appName,
      type: this.deploy.spec.resourceType
    };
    this.containers = JSON.parse(this.deploy.spec.metadata);
    this.service = JSON.parse(this.deploy.spec.service);
    this.volumeClaims = JSON.parse(this.deploy.spec.volumeClaims);
  }

  updateDeploy = async () => {
    try {
      await deployStore.update(
        this.deploy,
        {
          spec: {
            appName: this.app.name,
            resourceType: this.app.type,
            metadata: JSON.stringify(this.containers),
            service: JSON.stringify(this.service),
            volumeClaims: JSON.stringify(this.volumeClaims),
          },
        });
      this.reset();
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const header = <h5><Trans>Config Deploy Workload</Trans></h5>;

    return (
      <Dialog
        isOpen={ConfigDeployDialog.isOpen}
        onOpen={this.onOpen}
        close={this.close}
      >
        <Wizard className="ConfigDeployDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.updateDeploy}>
            <div className="init-form">
              <Collapse panelName={<Trans>App</Trans>}>
                <AppDetails value={this.app} onChange={value => this.app = value} />
              </Collapse>
              <br />
              <Collapse panelName={<Trans>MultiContainer</Trans>}>
                <MultiContainerDetails value={this.containers}
                  onChange={value => this.containers = value} />
              </Collapse>
              <br />
              <Collapse panelName={<Trans>DeployService</Trans>}>
                <DeployServiceDetails value={this.service}
                  onChange={value => this.service = value} />
              </Collapse>
              <br />
              <Collapse panelName={<Trans>MultiVolumeClaim</Trans>}>
                <MultiVolumeClaimDetails value={this.volumeClaims}
                  onChange={value => this.volumeClaims = value} />
              </Collapse>
            </div>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}