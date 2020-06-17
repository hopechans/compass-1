import "./config-copy-deploy-dialog.scss"

import React, {ReactElement} from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {computed, observable} from "mobx";
import {number, t, Trans} from "@lingui/macro";
import {Wizard, WizardStep} from "../wizard";
import {base, Container, container, MultiContainerDetails} from "../+deploy-container";
import {Collapse} from "antd";
import {deployService, DeployServiceDetails, Service} from "../+deploy-service";
import {MultiVolumeClaimDetails, VolumeClaimTemplate} from "../+deploy-volumeclaim-dialog";
import {app, App} from "../+deploy-app";
import {AppDetails} from "../+deploy-app";
import {Notifications} from "../notifications";
import {Deploy, deployApi} from "../../api/endpoints"

const {Panel} = Collapse;

interface Props extends DialogProps {

}

@observer
export class ConfigCopyAddDeployDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static data: Deploy;
  @observable app: App = app;
  @observable service: Service = deployService;
  @observable containers: Container[] = [container];
  @observable volumeClaims: VolumeClaimTemplate[] = [];

  static open(data: Deploy) {
    ConfigCopyAddDeployDialog.isOpen = true;
    ConfigCopyAddDeployDialog.data = data
  }

  static close() {
    ConfigCopyAddDeployDialog.isOpen = false;
  }

  close = () => {
    ConfigCopyAddDeployDialog.close();
  }

  reset = () => {
    this.app = app;
    this.service = deployService;
    this.containers = [container];
    this.volumeClaims = [];
  }

  onOpen = () => {
    this.app = {
      name: ConfigCopyAddDeployDialog.data.spec.appName,
      type: ConfigCopyAddDeployDialog.data.spec.resourceType
    };
    this.containers = JSON.parse(ConfigCopyAddDeployDialog.data.spec.metadata);
    this.service = JSON.parse(ConfigCopyAddDeployDialog.data.spec.service);
    this.volumeClaims = JSON.parse(ConfigCopyAddDeployDialog.data.spec.volumeClaims);
  }

  updateDeploy = async () => {
    const {app, containers, service, volumeClaims} = this;
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
          name: ConfigCopyAddDeployDialog.data.metadata.name
        },
        {...deploy});
      this.reset();
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const {...dialogProps} = this.props;
    const {app, containers, service, volumeClaims} = this;
    const header = <h5><Trans>Apply Deploy Workload</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        isOpen={ConfigCopyAddDeployDialog.isOpen}
        onOpen={this.onOpen}
        close={this.close}
      >
        <Wizard className="ConfigCopyAddDeployDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" nextLabel={<Trans>Apply</Trans>} next={this.updateDeploy}>
            <div className="init-form">
              <Collapse defaultActiveKey={'App'}>
                <Panel header={`App`} key="App">
                  <AppDetails value={app} onChange={value => this.app = value}/>
                </Panel>
              </Collapse>
              <br/>
              <Collapse>
                <Panel key={"MultiContainer"} header={"Containers"}>
                  <MultiContainerDetails value={containers}
                                         onChange={value => this.containers = value}/>
                </Panel>
              </Collapse>
              <br/>
              <Collapse>
                <Panel key={"DeployService"} header={"Service"}>
                  <DeployServiceDetails value={service}
                                        onChange={value => this.service = value}/>
                </Panel>
              </Collapse>
              <br/>
              <Collapse>
                <Panel key={"MultiVolumeClaim"} header={"VolumeClaims"}>
                  <MultiVolumeClaimDetails value={volumeClaims}
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