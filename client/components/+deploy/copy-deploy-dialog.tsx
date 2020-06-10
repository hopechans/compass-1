import "./copy-deploy-dialog.scss"

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
import {deployStore} from "./deploy.store";
import {Notifications} from "../notifications";

const {Panel} = Collapse;

interface Props extends DialogProps {

}

// export interface DeployTemplate {
//     type: string,
//     name: string,
//     strategy: string,
//     forms: any[],
//     volumeClaimTemplates: VolumeClaimTemplates,
// }

@observer
export class CopyAddDeployDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable app: App = app;
    @observable service: Service = deployService;
    @observable containers: Container[] = [container];
    @observable volumeClaims: VolumeClaimTemplate[] = [];

    static open() {
        CopyAddDeployDialog.isOpen = true;
    }

    static close() {
        CopyAddDeployDialog.isOpen = false;
    }

    close = () => {
        CopyAddDeployDialog.close();
    }

    addDeployDialog = async () => {

        try {
            await deployStore.create(
                {name: this.app.name+ '-' + Math.floor(Date.now() / 1000), namespace: ''}, {
                    spec: {
                        appName: this.app.name,
                        resourceType: this.app.type,
                        metadata: JSON.stringify(this.containers),
                    },
                }).then();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const header = <h5><Trans>Apply Deploy Workload</Trans></h5>;

        return (
            <Dialog
                isOpen={CopyAddDeployDialog.isOpen}
                close={this.close}
            >
                <Wizard className="CopyAddDeployDialog" header={header} done={this.close}>
                    <WizardStep contentClass="flex gaps column" next={this.addDeployDialog}>
                        <div className="init-form">
                            <Collapse defaultActiveKey={'App'}>
                                <Panel header={`App`} key="App">
                                    <AppDetails value={this.app} onChange={value => this.app = value}/>
                                </Panel>
                            </Collapse>
                            <br/>
                            <Collapse>
                                <Panel key={"MultiContainer"} header={"MultiContainer"}>
                                    <MultiContainerDetails
                                        value={this.containers}
                                        onChange={value => this.containers = value}/>
                                </Panel>
                            </Collapse>
                            <br/>
                            <Collapse>
                                <Panel key={"DeployService"} header={"DeployService"}>
                                    <DeployServiceDetails value={this.service}
                                                          onChange={value => this.service = value}/>
                                </Panel>
                            </Collapse>
                            <br/>
                            <Collapse>
                                <Panel key={"MultiVolumeClaim"} header={"MultiVolumeClaim"}>
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