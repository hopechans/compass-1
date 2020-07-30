import "./add-deploy-dialog.scss"

import React from "react";
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
import { configStore } from "../../config.store";

interface Props extends DialogProps {

}

@observer
export class AddDeployDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable app: App = app;
  @observable service: Service = deployService;
  @observable containers: Container[] = [container];
  @observable volumeClaims: VolumeClaimTemplate[] = [];

  static open() {
    AddDeployDialog.isOpen = true;
  }

  static close() {
    AddDeployDialog.isOpen = false;
  }

  close = () => {
    AddDeployDialog.close();
  }

  reset = () => {
    this.app = app;
    this.service = deployService;
    this.containers = [container];
    this.volumeClaims = [];
  }

  addDeployDialog = async () => {

    const { app, containers, service, volumeClaims } = this;
    const name = app.name + '-' + Math.floor(Date.now() / 1000)

    try {
      await deployStore.create(
        {
          name: name,
          namespace: '',
          labels: new Map<string, string>().set("namespace", configStore.getDefaultNamespace())
        },
        {
          spec: {
            appName: app.name,
            resourceType: app.type,
            metadata: JSON.stringify(containers),
            service: JSON.stringify(service),
            volumeClaims: JSON.stringify(volumeClaims),
          },
        });
      this.reset();
      Notifications.ok(
        <>Deploy {name} succeeded</>
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const header = <h5><Trans>Apply Deploy Workload</Trans></h5>;

    return (
      <Dialog
        isOpen={AddDeployDialog.isOpen}
        close={this.close}
      >
        <Wizard className="AddDeployDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.addDeployDialog}>
            <div className="init-form">
              <Collapse panelName={<Trans>Base</Trans>} key={"base"}>
                <AppDetails value={this.app} onChange={value => this.app = value} />
              </Collapse>
              <br />
              <Collapse panelName={<Trans>Containers</Trans>} key={"containers"}>
                <MultiContainerDetails value={this.containers}
                  onChange={value => this.containers = value} />
              </Collapse>
              <br />
              <Collapse panelName={<Trans>Service</Trans>} key={"services"}>
                <DeployServiceDetails value={this.service}
                  onChange={value => this.service = value} />
              </Collapse>
              <br />
              <Collapse panelName={<Trans>Volume</Trans>} key={"volume"}>
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