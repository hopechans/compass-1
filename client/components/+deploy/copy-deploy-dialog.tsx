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
import {Base, ContainerDetails, Environment, LifeCycle, Probe} from "../container-dialog";
import {Button} from "../button";
import {DeleteOutlined} from '@ant-design/icons';
import {Col, Collapse, Popconfirm, Row} from "antd";
import {isNumber} from "../input/input.validators";
import {VolumeClaimTemplateDetails} from "../volumeclaim-dialog/volumeclaim-template-details";

const {Panel} = Collapse;

interface ServicePorts {
    name: string,
    protocol: string,
    port: string,
    targetPort: string
}

interface Service {
    type: string,
    ports: ServicePorts[],
}

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
    @observable type: string = "Stone";
    @observable strategy: string = "";
    @observable name: string = "appName";
    @observable service: Service = {
        type: "NodePort",
        ports: []
    };
    @observable containers: Array<any> = [{
        base: base,
        commands: commands,
        args: args,
        oneEnvConfig: environment,
        readyProbe: readyProbe,
        liveProbe: liveProbe,
        lifeCycle: lifeCycle
    }];
    @observable step: number;

    static open() {
        CopyAddDeployDialog.isOpen = true;
    }

    static close() {
        CopyAddDeployDialog.isOpen = false;
    }

    close = () => {
        CopyAddDeployDialog.close();
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

    get protocolOptions() {
        return [
            "TCP",
            "UDP"
        ]
    }

    get serviceOptions() {
        return [
            "NodePort",
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

    addServicePort = () => {
        this.service.ports.push({
            name: "default-web-port",
            protocol: "TCP",
            port: "80",
            targetPort: "80"
        })
    }

    removeServicePort = (index: number) => {
        this.service.ports.splice(index, 1);
    }

    addDeployDialog = async () => {
    }

    render() {
        const {className, showIcons, showClusterOption, clusterOptionLabel, customizeOptions, ...selectProps} = this.props;
        const header = <h5><Trans>Apply Deploy Workload</Trans></h5>;

        const genExtra = (index: number) => {
            if (this.containers.length > 1) {
                return (
                    <Popconfirm
                        title="Confirm Delete?"
                        onConfirm={(event: any) => {
                            event.preventDefault()
                            event.stopPropagation()
                            this.containers.splice(index, 1)
                        }}
                        onCancel={(event: any) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                        okText="Yes"
                        cancelText="No">
                        <DeleteOutlined
                            translate style={{color: '#ff4d4f'}}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                        />
                    </Popconfirm>
                )
            }
            return (<></>)
        }

        const renderApp = () => {
            return (
                <Collapse defaultActiveKey={'App'}>
                    <Panel header={`App`} key="App">
                        <SubTitle title={<Trans>Type</Trans>}/>
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
                    </Panel>
                </Collapse>
            )
        }

        const renderService = () => {
            return (
                <Collapse>
                    <Panel header={`Service`} key="Service">
                        <SubTitle title={<Trans>Service</Trans>}/>
                        <Select
                            formatOptionLabel={this.formatOptionLabel}
                            options={this.serviceOptions}
                            value={this.service.type}
                            onChange={v => {
                                this.service.type = v.value
                            }}
                        />
                        <SubTitle compact className="fields-title" title="Ports">
                            <Icon
                                small
                                tooltip={_i18n._(t`Ports`)}
                                material="add_circle_outline"
                                onClick={(e) => {
                                    this.addServicePort();
                                    e.stopPropagation();
                                }}
                            />
                        </SubTitle>
                        <div className="ports">
                            {this.service.ports.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <br/>
                                        <Row>
                                            <Col>
                                                <Icon
                                                    small
                                                    tooltip={<Trans>Remove Command</Trans>}
                                                    className="remove-icon"
                                                    material="remove_circle_outline"
                                                    onClick={(e) => {
                                                        this.removeServicePort(index);
                                                        e.stopPropagation()
                                                    }}
                                                />
                                            </Col>
                                            <Col offset={1}><p>---------------- {index + 1} ----------------</p></Col>
                                        </Row>
                                        <SubTitle title={<Trans>Name</Trans>}/>
                                        <Input
                                            className="item"
                                            placeholder={_i18n._(t`Name`)}
                                            title={this.service.ports[index].name}
                                            value={this.service.ports[index].name}
                                            onChange={value => {
                                                this.service.ports[index].name = value
                                            }}
                                        />
                                        <SubTitle title={<Trans>Protocol</Trans>}/>
                                        <Select
                                            formatOptionLabel={this.formatOptionLabel}
                                            options={this.protocolOptions}
                                            value={this.service.ports[index].protocol}
                                            onChange={v => {
                                                this.service.ports[index].protocol = v.value;
                                            }}
                                        />
                                        <br/>
                                        <Row>
                                            <Col span={10}>
                                                <SubTitle title={<Trans>Port</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Port`)}
                                                    type="number"
                                                    validators={isNumber}
                                                    value={this.service.ports[index].port}
                                                    onChange={value => this.service.ports[index].port = value}
                                                />
                                            </Col>
                                            <Col span={10} offset={4}>
                                                <SubTitle title={<Trans>TargetPort</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`TargetPort`)}
                                                    type="number"
                                                    validators={isNumber}
                                                    value={this.service.ports[index].targetPort}
                                                    onChange={value => this.service.ports[index].targetPort = value}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            })}
                        </div>
                    </Panel>
                </Collapse>
            )
        }

        const renderVolumeClaimTemplates = () => {
            return (
                <Collapse>
                    <Panel key={"VolumeClaimTemplates"} header={"VolumeClaimTemplates"}>
                        <VolumeClaimTemplateDetails/>
                    </Panel>
                </Collapse>
            )
        }

        const renderContainer = () => {
            return (
                <>
                    <br/>
                    <Button primary onClick={() => this.addContainer()}><span>Addition Container</span></Button>
                    <br/><br/>
                    <Collapse>
                        {this.containers.map((item, index) => {
                            return (
                                <Panel header={`Container`} key={index} extra={genExtra(index)}>
                                    <ContainerDetails
                                        base={true}
                                        commands={true} args={true}
                                        environment={true}
                                        readyProbe={true} liveProbe={true}
                                        lifeCycle={true}
                                        divider={true}
                                        value={this.containers[index]}
                                        onChange={(value: any) => {
                                            this.containers[index] = value
                                        }}/>
                                </Panel>
                            )
                        })}
                    </Collapse>
                </>
            )
        }

        return (
            <Dialog
                isOpen={CopyAddDeployDialog.isOpen}
                close={this.close}
            >
                <Wizard className="CopyAddDeployDialog" header={header} done={this.close}>
                    <WizardStep contentClass="flex gaps column">
                        <div className="init-form">
                            {renderApp()}
                            <br/>
                            {renderContainer()}
                            <br/>
                            {renderService()}
                            <br/>
                            {renderVolumeClaimTemplates()}
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}