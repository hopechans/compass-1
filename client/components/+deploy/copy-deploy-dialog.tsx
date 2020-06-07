import "./copy-deploy-dialog.scss"

import React, {ReactElement} from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {number, t, Trans} from "@lingui/macro";
import {Wizard, WizardStep} from "../wizard";
import {Select, SelectOption, SelectProps} from "../select";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {Base, ContainerDetails, Environment, LifeCycle, Probe, VolumeClaimTemplates} from "../container-dialog";
import {Button} from "../button";

const base: Base = {
    name: "default",
    image: "app:latest",
    imagePullPolicy: "IfNotPresent",
    resource: {
        limits: {
            cpu: "0.3",
            memory: "170",
        },
        requests: {
            cpu: "0.1",
            memory: "30"
        }
    }
};
const commands: string[] = [];
const args: string[] = [];
const environment: Environment[] = [];
const readyProbe: Probe = {
    status: false,
    timeout: "",
    cycle: "",
    retryCount: "",
    delay: "",
    pattern: {
        type: "HTTP",
        httpPort: "8081",
        url: "",
        tcpPort: "0",
        command: "",
    }
};
const liveProbe: Probe = {
    status: false,
    timeout: "",
    cycle: "",
    retryCount: "",
    delay: "",
    pattern: {
        type: "HTTP",
        httpPort: "8082",
        url: "",
        tcpPort: "0",
        command: "",
    }
};
const lifeCycle: LifeCycle = {
    status: false,
    postStart: {
        type: "HTTP",
        httpPort: "8080",
        url: "",
        tcpPort: "0",
        command: "",
    },
    preStop: {
        type: "HTTP",
        httpPort: "8080",
        url: "",
        tcpPort: "0",
        command: "",
    }
};

interface Props extends SelectProps {
    showIcons?: boolean;
    showClusterOption?: boolean; // show cluster option on the top (default: false)
    clusterOptionLabel?: React.ReactNode; // label for cluster option (default: "Cluster")
    customizeOptions?(nsOptions: SelectOption[]): SelectOption[];
}

export interface DeployTemplate {
    type: string,
    name: string,
    strategy: string,
    forms: any[],
    volumeClaimTemplates: VolumeClaimTemplates,
}

@observer
export class CopyAddDeployDialog extends React.Component<Props> {


    @observable static isOpen = false;
    @observable type: string = "Stone";
    @observable strategy: string = "";
    @observable name: string = "appName";

    @observable containers: Array<any> = [];
    @observable step: number;

    static open() {
        CopyAddDeployDialog.isOpen = true;
    }

    static close() {
        CopyAddDeployDialog.isOpen = false;
    }

    close = () => {
        CopyAddDeployDialog.close();
        this.containers = [];
        this.step = 1;
    }

    get typeOptions() {
        return [
            "Stone",
            "Water",
            "Deployment",
            "Statefulset"
        ]
    }

    formatOptionLabel = (option: SelectOption) => {
        const {showIcons} = this.props;
        const {value, label} = option;
        return label || (
            <>
                {showIcons && <Icon small material="layers"/>}
                {value}
            </>
        );
    }

    addContainer = () => {
        this.containers.push({
            base: base,
            commands: commands,
            args: args,
            oneEnvConfig: environment,
            readyProbe: readyProbe,
            liveProbe: liveProbe,
            lifeCycle: lifeCycle
        });
    }

    removeContainer = () => {
        if (this.containers.length > 0 && this.step > 1) {
            this.containers.splice(this.step-2, 1);
        }
    }

    addDeployDialog = async () => {
    }

    render() {
        const {className, showIcons, showClusterOption, clusterOptionLabel, customizeOptions, ...selectProps} = this.props;
        const header = <h5><Trans>Apply Deploy Workload</Trans></h5>;

        const moreButtons = (
            <div className="moreButtons">
                <Button primary onClick={this.addContainer}><Trans>Add container</Trans></Button>&nbsp;
                {
                    this.containers.length > 0 && this.step > 1 ?
                        <Button primary onClick={this.removeContainer}><Trans>Remove container</Trans></Button> : ""
                }
            </div>
        )

        const children = () => {
            const deploy = [
                <WizardStep
                    contentClass="flex gaps column" moreButtons={moreButtons}>
                    <div className="init-form">
                        <Select
                            formatOptionLabel={this.formatOptionLabel}
                            options={this.typeOptions}
                            value={this.type}
                            onChange={v => this.type = v}
                            {...selectProps}
                        />
                        <SubTitle title={<Trans>Field name</Trans>}/>
                        <Input
                            autoFocus required
                            placeholder={_i18n._(t`Name`)}
                            value={this.name}
                            onChange={v => this.name = v}
                        />
                    </div>
                </WizardStep>
            ]

            const containers = this.containers.map((item, index) => {
                return (
                    <WizardStep
                        contentClass="flex gaps column" moreButtons={moreButtons} noValidate={true}>
                        <p>step: {this.step}</p>
                        <ContainerDetails
                            base={true}
                            commands={true} args={true}
                            environment={true}
                            readyProbe={true} liveProbe={true}
                            lifeCycle={true}
                            divider={true}
                            value={this.containers[index]}
                            onChange={(value: any) => console.log(value)}/>
                    </WizardStep>
                )
            })
            if (containers.length > 0) {
                containers.forEach(item => deploy.push(item))
            }
            return deploy
        }

        return (
            <Dialog
                isOpen={CopyAddDeployDialog.isOpen}
                close={this.close}
            >
                <Wizard className="CopyAddDeployDialog"
                        header={header} done={this.close} step={this.step} onChange={(step) => (this.step = step)}
                >
                    {children()}
                </Wizard>
            </Dialog>
        )
    }
}