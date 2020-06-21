import "./add-deploy-dialog.scss"

import React, {ReactElement} from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {computed, observable} from "mobx";
import {number, t, Trans} from "@lingui/macro";
import {Wizard, WizardStep} from "../wizard";
import {Container, container, MultiContainerDetails} from "../+deploy-container";
import {Collapse} from "antd";
import {deployService, DeployServiceDetails, Service} from "../+deploy-service";
import {MultiVolumeClaimDetails, VolumeClaimTemplate} from "../+deploy-volumeclaim-dialog";
import {app, App} from "../+deploy-app";
import {AppDetails} from "../+deploy-app";
import {deployStore} from "./deploy.store";
import {Notifications} from "../notifications";
import {configStore} from "../../config.store";

const {Panel} = Collapse;

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
    try {
      const newDeploy = await deployStore.create(
        {name: this.app.name + '-' + Math.floor(Date.now() / 1000), namespace: ''}, {
          spec: {
            appName: this.app.name,
            resourceType: this.app.type,
            metadata: JSON.stringify(this.containers),
            service: JSON.stringify(this.service),
            volumeClaims: JSON.stringify(this.volumeClaims),
          },
        });
      // label the resource labels
      newDeploy.metadata.labels = {namespace: configStore.getDefaultNamespace()}
      await deployStore.update(newDeploy, {...newDeploy});
      this.reset();
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
              <Collapse defaultActiveKey={'App'}>
                <Panel header={`App`} key="App">
                  <AppDetails value={this.app} onChange={value => this.app = value}/>
                </Panel>
              </Collapse>
              <br/>
              <Collapse>
                <Panel key={"MultiContainer"} header={"Containers"}>
                  <MultiContainerDetails value={this.containers}
                                         onChange={value => this.containers = value}/>
                </Panel>
              </Collapse>
              <br/>
              <Collapse>
                <Panel key={"DeployService"} header={"Service"}>
                  <DeployServiceDetails value={this.service}
                                        onChange={value => this.service = value}/>
                </Panel>
              </Collapse>
              <br/>
              <Collapse>
                <Panel key={"MultiVolumeClaim"} header={"VolumeClaims"}>
                  <MultiVolumeClaimDetails value={this.volumeClaims}
                                           onChange={value => this.volumeClaims = value}/>
                </Panel>
              </Collapse>
            </div>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}