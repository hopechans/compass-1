import "./copy-deploy-dialog.scss"

import React, {ReactElement} from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {number, t, Trans} from "@lingui/macro";
import {Wizard, WizardStep} from "../wizard";
import {Container, container} from "../+deploy-container";
import {Collapse} from "antd";
import {deployService, DeployServiceDetails, Service} from "../+deploy-service";
import {MultiContainerDetails} from "../+deploy-container/multi-container-details";
import {MultiVolumeClaimDetails, VolumeClaimTemplate} from "../+deploy-volumeclaim-dialog";
import {app, App} from "../+deploy-app";
import {AppDetails} from "../+deploy-app";

const {Panel} = Collapse;

interface Props extends DialogProps{

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
    @observable containers: Array<Container> = [container];
    @observable volumeClaim: Array<VolumeClaimTemplate> = [];

    static open() {
        CopyAddDeployDialog.isOpen = true;
    }

    static close() {
        CopyAddDeployDialog.isOpen = false;
    }

    close = () => {
        CopyAddDeployDialog.close();
    }

    addDeployDialog = async () => {}

    render() {
        const header = <h5><Trans>Apply Deploy Workload</Trans></h5>;

        return (
            <Dialog
                isOpen={CopyAddDeployDialog.isOpen}
                close={this.close}
            >
                <Wizard className="CopyAddDeployDialog" header={header} done={this.close}>
                    <WizardStep contentClass="flex gaps column">
                        <div className="init-form">
                            <Collapse defaultActiveKey={'App'}>
                                <Panel header={`App`} key="App">
                                    <AppDetails value={this.app} onChange={value => this.app = value} />
                                </Panel>
                            </Collapse>
                            <br/>
                            <Collapse>
                                <Panel key={"MultiContainer"} header={"MultiContainer"}>
                                    <MultiContainerDetails value={this.containers} onChange={value => this.containers = value} />
                                </Panel>
                            </Collapse>
                            <br/>
                            <Collapse>
                                <Panel key={"DeployService"} header={"DeployService"}>
                                    <DeployServiceDetails value={this.service} onChange={value => {this.service = value}}/>
                                </Panel>
                            </Collapse>
                            <br/>
                            <Collapse>
                                <Panel key={"MultiVolumeClaim"} header={"MultiVolumeClaim"}>
                                    <MultiVolumeClaimDetails/>
                                </Panel>
                            </Collapse>
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}