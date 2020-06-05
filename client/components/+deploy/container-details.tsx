import React from "react";
import {observer} from "mobx-react";
import {number, t, Trans} from "@lingui/macro";
import {Select, SelectOption, SelectProps} from "../select";
import {_i18n} from "../../i18n";
import {observable} from "mobx";
import {Row, Col} from "antd";
import {Input} from "../input";
import {SubTitle} from "../layout/sub-title";
import {systemName, isNumber} from "../input/input.validators";
import {WizardStep} from "../wizard";
import {Icon} from "../icon";
import upperFirst from "lodash/upperFirst";
import {Checkbox} from "../checkbox";

export class Environment {
    type: string
    oneEnvConfig: any
}

export class VolumeMount {
    status: boolean;
    name: string;
    readOnly: boolean;
    mouthPath: string;

    constructor() {
        this.status = false;
        this.name = '';
        this.readOnly = true;
        this.mouthPath = '';
    }
}

export class Pattern {
    type: string;
    httpPort: number | string;
    url: string;
    tcpPort: number | string;
    command: string;

    constructor() {
        this.type = '1'; // HTTP
        this.httpPort = 8080;
        this.url = '';
        this.tcpPort = 0;
        this.command = '';
    };
}

export class Probe {
    status: boolean;
    timeout: string | number;
    cycle: string | number;
    retryCount: string | number;
    delay: string | number;
    pattern?: Pattern;

    constructor() {
        this.status = false;
        this.timeout = 0;
        this.cycle = 0;
        this.retryCount = 0;
        this.delay = 0;
        this.pattern = new Pattern();
    }
}

export class LifeCycle {
    status: boolean;
    postStart?: Pattern;
    preStop?: Pattern;

    constructor() {
        this.status = false;
        this.postStart = new Pattern();
        this.preStop = new Pattern();
    }
}

export class Limitation {
    cpu: string;
    memory: string;

    constructor(cpu: string, memory: string) {
        this.cpu = cpu;
        this.memory = memory;
    }
}

class Resource {
    limits: Limitation;
    requests: Limitation;

    constructor() {
        this.limits = new Limitation("0.3", "170");
        this.requests = new Limitation("0.1", "30");
    }
}

export class VolumeClaimTemplateMetadata {
    isUseDefaultStorageClass: boolean;
    name: string;
    annotations: Map<string, string>;

    constructor() {
        this.name = '';
        const annotations = new Map<string, string>();
        if (this.isUseDefaultStorageClass) {
            annotations.set('volume.alpha.kubernetes.io/storage-class', 'default')
        }
    }
}

export class VolumeClaimTemplateSpecResourcesRequests {
    storage: number | string;
    accessModes: string[];
    storageClassName: string;
    resources: any;

    constructor() {
        this.storage = '200Mi';
        this.accessModes = ["ReadWriteOnce"];
        this.resources = {requests: {storage: this.storage}};
    }

    setStorageClassName(name: string) {
        this.storageClassName = name
    }

    setStorageSize(size: number | string) {
        if (typeof size === 'string') {
            this.storage = size
        } else {
            this.storage = size.toString() + 'Gi'
        }
    }
}

export class VolumeClaimTemplateSpecResources {
    requests: VolumeClaimTemplateSpecResourcesRequests
}

export class VolumeClaimTemplateSpec {
    accessModes: string[];
    resources: VolumeClaimTemplateSpecResources;
}

export class VolumeClaimTemplate {
    metadata: VolumeClaimTemplateMetadata;
    spec: VolumeClaimTemplateSpec;
}

export class VolumeClaimTemplates {
    status: boolean;
    volumeClaimTemplates: Array<VolumeClaimTemplate>;
}


export interface ContainerProps extends Partial<ContainerProps> {
}


@observer
export class ContainerDetails extends React.Component<ContainerProps> {

    @observable name: string = "default";
    @observable image: string = "app:latest";
    @observable imagePullPolicy: string = "IfNotPresent";
    @observable resource: Resource = {
        limits: {
            cpu: "0.3",
            memory: "170",
        },
        requests: {
            cpu: "0.1",
            memory: "30"
        }
    };
    @observable commands: string[] = [];
    @observable args: string[] = [];
    @observable environment: Environment[] = [];
    @observable readyProbeBool: boolean = false;
    @observable readyProbe: any = {
        timeout: "0",
        period: "0",
        failure: "0",
        initialDelay: 0,
        probeType: "HTTP",
        http: 8080,
        url: "",
        tcp: 0,
        command: ""
    };

    @observable liveProbeBool: boolean = false;
    @observable liveProbe: any = {
        timeout: "0",
        period: "0",
        failure: "0",
        initialDelay: 0,
        probeType: "HTTP",
        http: 8080,
        url: "",
        tcp: 0,
        command: ""
    };

    @observable lifecycleBool: boolean = false;
    @observable lifecycle: any = {
        postStart: {
            type: 'None',
            http: 8080,
            url: "",
            tcp: 0,
            command: ""
        },
        preStop: {
            type: 'None',
            http: 8080,
            url: "",
            tcp: 0,
            command: ""
        }
    }

    get imagePullPolicyOptions() {
        return [
            "IfNotPresent",
            "Always",
            "Never",
        ]
    }

    get environmentOptions() {
        return [
            "Custom Environment",
            "From Configuration",
            "From Secret",
            "Other"
        ]
    }

    get readyProbeOptions() {
        return [
            "HTTP",
            "TCP",
            "Command"
        ]
    }

    get postStartOptions() {
        return [
            "HTTP",
            "TCP",
            "Command"
        ]
    }

    get preStopOptions() {
        return [
            "HTTP",
            "TCP",
            "Command"
        ]
    }

    formatOptionLabel = (option: SelectOption) => {
        const {value, label} = option;
        return label || (
            <>
                <Icon small material="layers"/>
                {value}
            </>
        );
    }


    addCommand = () => {
        this.commands.push("");
    }

    removeCommand = (index: number) => {
        this.commands.splice(index, 1);
    }

    addArgs = () => {
        this.args.push("");
    }

    removeArgs = (index: number) => {
        this.args.splice(index, 1);
    }

    addEnvironment = () => {
        const environment: Environment = {type: "Custom Environment", oneEnvConfig: {}}
        this.environment.push(environment);
    }

    removeEnvironment = (index: number) => {
        this.environment.splice(index, 1);
    }

    renderAddCommand() {
        return (
            <>
                <SubTitle compact className="fields-title" title="addCommand">
                    <Icon
                        small
                        tooltip={_i18n._(t`Command`)}
                        material="add_circle_outline"
                        onClick={() => this.addCommand()}
                    />
                </SubTitle>
                <div className="command">
                    {this.commands.map((item, index) => {
                        return (
                            <div key={index}>
                                <Row>
                                    <Col span="23">
                                        <Input
                                            className="item"
                                            placeholder={_i18n._(t`Enter a command`)}
                                            title={this.commands[index]}
                                            value={this.commands[index]} onChange={value => {
                                            this.commands[index] = value
                                        }}
                                        />
                                    </Col>
                                    <Col span="1">
                                        <Icon
                                            small
                                            tooltip={<Trans>Remove Command</Trans>}
                                            className="remove-icon"
                                            material="remove_circle_outline"
                                            onClick={() => this.removeCommand(index)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }

    renderAddArgs() {
        return (
            <>
                <SubTitle compact className="fields-title" title="addArgs">
                    <Icon
                        small
                        tooltip={_i18n._(t`Args`)}
                        material="add_circle_outline"
                        onClick={() => this.addArgs()}
                    />
                </SubTitle>
                <div className="args">
                    {this.args.map((item, index) => {
                        return (
                            <div key={index}>
                                <Row>
                                    <Col span="23">
                                        <Input
                                            className="item"
                                            placeholder={_i18n._(t`Enter a args`)}
                                            title={this.args[index]}
                                            value={this.args[index]} onChange={value => {
                                            this.args[index] = value
                                        }}
                                        />
                                    </Col>
                                    <Col span="1">
                                        <Icon
                                            small
                                            tooltip={<Trans>Remove Args</Trans>}
                                            className="remove-icon"
                                            material="remove_circle_outline"
                                            onClick={() => this.removeArgs(index)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }

    renderEnvironment() {
        return (
            <>
                <SubTitle compact className="fields-title" title="addEnvironment">
                    <Icon
                        small
                        tooltip={_i18n._(t`Environment`)}
                        material="add_circle_outline"
                        onClick={() => this.addEnvironment()}
                    />
                </SubTitle>
                <div className="environment">
                    {this.environment.map((item, index) => {
                        return (
                            <>
                                <div key={index}>
                                    <Icon
                                        small
                                        tooltip={<Trans>Remove Environment</Trans>}
                                        className="remove-icon"
                                        material="remove_circle_outline"
                                        onClick={() => this.removeEnvironment(index)}
                                    />
                                    <br/><br/>
                                    <Select
                                        formatOptionLabel={this.formatOptionLabel}
                                        options={this.environmentOptions}
                                        value={item.type}
                                        onChange={v => {
                                            this.environment[index].type = v.value;
                                        }}
                                    />
                                    {
                                        this.environment[index].type == "Custom Environment" ?
                                            <>
                                                <SubTitle title={<Trans>Name</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Name`)}
                                                    value={this.environment[index].oneEnvConfig.name}
                                                    onChange={value => this.environment[index].oneEnvConfig.name = value}
                                                />
                                                <SubTitle title={<Trans>Value</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Value`)}
                                                    value={this.environment[index].oneEnvConfig.value}
                                                    onChange={value => this.environment[index].oneEnvConfig.value = value}
                                                />
                                            </> : <></>
                                    }
                                    {
                                        this.environment[index].type == "From Configuration" ?
                                            <>
                                                <SubTitle title={<Trans>Environment</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Environment`)}
                                                    value={this.environment[index].oneEnvConfig.environment}
                                                    onChange={value => this.environment[index].oneEnvConfig.environment = value}
                                                />
                                                <SubTitle title={<Trans>Configure</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Configure`)}
                                                    value={this.environment[index].oneEnvConfig.configure}
                                                    onChange={value => this.environment[index].oneEnvConfig.configure = value}
                                                />
                                                <SubTitle title={<Trans>Key</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Key`)}
                                                    value={this.environment[index].oneEnvConfig.key}
                                                    onChange={value => this.environment[index].oneEnvConfig.key = value}
                                                />
                                            </> : <></>
                                    }
                                    {
                                        this.environment[index].type == "From Secret" ?
                                            <>
                                                <SubTitle title={<Trans>Name</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Name`)}
                                                    value={this.environment[index].oneEnvConfig.name}
                                                    onChange={value => this.environment[index].oneEnvConfig.name = value}
                                                />
                                                <SubTitle title={<Trans>Configure</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Secret Name`)}
                                                    value={this.environment[index].oneEnvConfig.selectName}
                                                    onChange={value => this.environment[index].oneEnvConfig.selectName = value}
                                                />
                                                <SubTitle title={<Trans>Key</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Secret Key`)}
                                                    value={this.environment[index].oneEnvConfig.selectKey}
                                                    onChange={value => this.environment[index].oneEnvConfig.selectKey = value}
                                                />
                                            </> : <></>
                                    }
                                    {
                                        this.environment[index].type == "Other" ?
                                            <>
                                                <SubTitle title={<Trans>Enter Command</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`Enter Command`)}
                                                    value={this.environment[index].oneEnvConfig.enterCommand}
                                                    onChange={value => this.environment[index].oneEnvConfig.enterCommand = value}
                                                />
                                            </> : <></>
                                    }
                                </div>
                                <br/>
                            </>
                        )
                    })}
                </div>
            </>
        )
    }

    renderReadyProbe() {
        return (
            <>
                <Checkbox
                    theme="light"
                    label={<Trans>Readiness Probe</Trans>}
                    value={this.readyProbeBool}
                    onChange={v => this.readyProbeBool = v}
                />
                {
                    this.readyProbeBool ?
                        <>
                            <Row>
                                <Col span="10">
                                    <SubTitle title={<Trans>Timeout</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Timeout`)} validators={isNumber}
                                        value={this.readyProbe.timeout}
                                        onChange={value => this.readyProbe.timeout = value}
                                    />
                                    <SubTitle title={<Trans>Period</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Period`)} validators={isNumber}
                                        value={this.readyProbe.period}
                                        onChange={value => this.readyProbe.period = value}
                                    />
                                </Col>
                                <Col span="10" offset="4">
                                    <SubTitle title={<Trans>Failure</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Failure`)} validators={isNumber}
                                        value={this.readyProbe.failure}
                                        onChange={value => this.readyProbe.failure = value}
                                    />
                                    <SubTitle title={<Trans>InitialDelay</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`InitialDelay`)} validators={isNumber}
                                        value={this.readyProbe.initialDelay}
                                        onChange={value => this.readyProbe.initialDelay = value}
                                    />
                                </Col>
                            </Row>
                            <Select
                                formatOptionLabel={this.formatOptionLabel}
                                options={this.readyProbeOptions}
                                value={this.readyProbe.probeType}
                                onChange={value => this.readyProbe.probeType = value.value}
                            />
                            {
                                this.readyProbe.probeType == "HTTP" ?
                                    <>
                                        <Row>
                                            <Col span="10">
                                                <SubTitle title={<Trans>HTTP</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`HTTP`)} validators={isNumber}
                                                    value={this.readyProbe.http}
                                                    onChange={value => this.readyProbe.http = value}
                                                />
                                            </Col>
                                            <Col span="10" offset="4">
                                                <SubTitle title={<Trans>URL</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`URL`)}
                                                    value={this.readyProbe.url}
                                                    onChange={value => this.readyProbe.url = value}
                                                />
                                            </Col>
                                        </Row>
                                    </> : <></>
                            }
                            {
                                this.readyProbe.probeType == "TCP" ?
                                    <>
                                        <SubTitle title={<Trans>TCP</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`TCP`)} validators={isNumber}
                                            value={this.readyProbe.tcp} onChange={value => this.readyProbe.tcp = value}
                                        />
                                    </> : <></>
                            }
                            {
                                this.readyProbe.probeType == "Command" ?
                                    <>
                                        <SubTitle title={<Trans>Command</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`Command`)}
                                            value={this.readyProbe.command}
                                            onChange={value => this.readyProbe.command = value}
                                        />
                                    </> : <></>
                            }
                        </> : <></>
                }
            </>
        )
    }

    renderLiveProbe() {
        return (
            <>
                <Checkbox
                    theme="light"
                    label={<Trans>Liveness Probe</Trans>}
                    value={this.liveProbeBool}
                    onChange={v => this.liveProbeBool = v}
                />
                {
                    this.liveProbeBool ?
                        <>
                            <Row>
                                <Col span="10">
                                    <SubTitle title={<Trans>Timeout</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Timeout`)} validators={isNumber}
                                        value={this.liveProbe.timeout}
                                        onChange={value => this.liveProbe.timeout = value}
                                    />
                                    <SubTitle title={<Trans>Period</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Period`)} validators={isNumber}
                                        value={this.liveProbe.period} onChange={value => this.liveProbe.period = value}
                                    />
                                </Col>
                                <Col span="10" offset="4">
                                    <SubTitle title={<Trans>Failure</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Failure`)} validators={isNumber}
                                        value={this.liveProbe.failure}
                                        onChange={value => this.liveProbe.failure = value}
                                    />
                                    <SubTitle title={<Trans>InitialDelay</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`InitialDelay`)} validators={isNumber}
                                        value={this.liveProbe.initialDelay}
                                        onChange={value => this.liveProbe.initialDelay = value}
                                    />
                                </Col>
                            </Row>
                            <Select
                                formatOptionLabel={this.formatOptionLabel}
                                options={this.readyProbeOptions}
                                value={this.liveProbe.probeType}
                                onChange={value => this.liveProbe.probeType = value.value}
                            />
                            {
                                this.liveProbe.probeType == "HTTP" ?
                                    <>
                                        <Row>
                                            <Col span="10">
                                                <SubTitle title={<Trans>HTTP</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`HTTP`)} validators={isNumber}
                                                    value={this.liveProbe.http}
                                                    onChange={value => this.liveProbe.http = value}
                                                />
                                            </Col>
                                            <Col span="10" offset="4">
                                                <SubTitle title={<Trans>URL</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`URL`)}
                                                    value={this.liveProbe.url}
                                                    onChange={value => this.liveProbe.url = value}
                                                />
                                            </Col>
                                        </Row>
                                    </> : <></>
                            }
                            {
                                this.liveProbe.probeType == "TCP" ?
                                    <>
                                        <SubTitle title={<Trans>TCP</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`TCP`)} validators={isNumber}
                                            value={this.liveProbe.tcp} onChange={value => this.liveProbe.tcp = value}
                                        />
                                    </> : <></>
                            }
                            {
                                this.liveProbe.probeType == "Command" ?
                                    <>
                                        <SubTitle title={<Trans>Command</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`Command`)}
                                            value={this.liveProbe.command}
                                            onChange={value => this.liveProbe.command = value}
                                        />
                                    </> : <></>
                            }
                        </> : <></>
                }
            </>
        )
    }

    renderLifecycle() {
        return (
            <>
                <Checkbox
                    theme="light"
                    label={<Trans>Lifecycle</Trans>}
                    value={this.lifecycleBool}
                    onChange={v => this.lifecycleBool = v}
                />
                {
                    this.lifecycleBool ?
                        <>
                            <SubTitle title={<Trans>postStart</Trans>}/>
                            <Select
                                formatOptionLabel={this.formatOptionLabel}
                                options={this.readyProbeOptions}
                                value={this.lifecycle.postStart.type}
                                onChange={value => this.lifecycle.postStart.type = value.value}
                            />
                            {
                                this.lifecycle.postStart.type == "HTTP" ?
                                    <>
                                        <Row>
                                            <Col span="10">
                                                <SubTitle title={<Trans>HTTP</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`HTTP`)} validators={isNumber}
                                                    value={this.lifecycle.postStart.http}
                                                    onChange={value => this.lifecycle.postStart.http = value}
                                                />
                                            </Col>
                                            <Col span="10" offset="4">
                                                <SubTitle title={<Trans>URL</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`URL`)}
                                                    value={this.lifecycle.postStart.url}
                                                    onChange={value => this.lifecycle.postStart.url = value}
                                                />
                                            </Col>
                                        </Row>
                                    </> : <></>
                            }
                            {
                                this.lifecycle.postStart.type == "TCP" ?
                                    <>
                                        <SubTitle title={<Trans>TCP</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`TCP`)} validators={isNumber}
                                            value={this.lifecycle.postStart.tcp}
                                            onChange={value => this.lifecycle.postStart.tcp = value}
                                        />
                                    </> : <></>
                            }
                            {
                                this.lifecycle.postStart.type == "Command" ?
                                    <>
                                        <SubTitle title={<Trans>Command</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`Command`)}
                                            value={this.lifecycle.postStart.command}
                                            onChange={value => this.lifecycle.postStart.command = value}
                                        />
                                    </> : <></>
                            }
                            <SubTitle title={<Trans>preStop</Trans>}/>
                            <Select
                                formatOptionLabel={this.formatOptionLabel}
                                options={this.readyProbeOptions}
                                value={this.lifecycle.preStop.type}
                                onChange={value => this.lifecycle.preStop.type = value.value}
                            />
                            {
                                this.lifecycle.preStop.type == "HTTP" ?
                                    <>
                                        <Row>
                                            <Col span="10">
                                                <SubTitle title={<Trans>HTTP</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`HTTP`)} validators={isNumber}
                                                    value={this.lifecycle.preStop.http}
                                                    onChange={value => this.lifecycle.preStop.http = value}
                                                />
                                            </Col>
                                            <Col span="10" offset="4">
                                                <SubTitle title={<Trans>URL</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`URL`)}
                                                    value={this.lifecycle.preStop.url}
                                                    onChange={value => this.lifecycle.preStop.url = value}
                                                />
                                            </Col>
                                        </Row>
                                    </> : <></>
                            }
                            {
                                this.lifecycle.preStop.type == "TCP" ?
                                    <>
                                        <SubTitle title={<Trans>TCP</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`TCP`)} validators={isNumber}
                                            value={this.lifecycle.preStop.tcp}
                                            onChange={value => this.lifecycle.preStop.tcp = value}
                                        />
                                    </> : <></>
                            }
                            {
                                this.lifecycle.preStop.type == "Command" ?
                                    <>
                                        <SubTitle title={<Trans>Command</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`Command`)}
                                            value={this.lifecycle.preStop.command}
                                            onChange={value => this.lifecycle.preStop.command = value}
                                        />
                                    </> : <></>
                            }
                        </> : <></>
                }
            </>
        )
    }

    render() {
        return (
            <>
                <SubTitle title={<Trans>ContainerName</Trans>}/>
                <Input
                    placeholder={_i18n._(t`Enter a container name`)} validators={systemName}
                    value={this.name} onChange={v => this.name = v}
                />
                <SubTitle title={<Trans>ImageAddress</Trans>}/>
                <Input
                    placeholder={_i18n._(t`Enter a image`)} validators={systemName}
                    value={this.image} onChange={v => this.image = v}
                />
                <SubTitle title={<Trans>ImagePullPolicy</Trans>}/>
                <Select
                    formatOptionLabel={this.formatOptionLabel}
                    options={this.imagePullPolicyOptions}
                    value={this.imagePullPolicy} onChange={value => this.imagePullPolicy = value}
                />
                <Row justify="space-between">
                    <Col span="10">
                        <SubTitle title={<Trans>Limit CPU</Trans>}/>
                        <Input
                            placeholder={_i18n._(t`Enter a limit cpu`)} validators={isNumber}
                            value={this.resource.limits.cpu} onChange={value => this.resource.limits.cpu = value}
                        />
                    </Col>
                    <Col span="10">
                        <SubTitle title={<Trans>Limit Memory</Trans>}/>
                        <Input
                            placeholder={_i18n._(t`Enter a limit memory`)} validators={isNumber}
                            value={this.resource.limits.memory} onChange={value => this.resource.limits.memory = value}
                        />
                    </Col>
                </Row>
                <Row justify="space-between">
                    <Col span="10">
                        <SubTitle title={<Trans>Require CPU</Trans>}/>
                        <Input
                            placeholder={_i18n._(t`Enter a required cpu`)} validators={isNumber}
                            value={this.resource.requests.cpu} onChange={value => this.resource.requests.cpu = value}
                        />
                    </Col>
                    <Col span="10">
                        <SubTitle title={<Trans>Require Memory</Trans>}/>
                        <Input
                            placeholder={_i18n._(t`Enter a required memory`)} validators={isNumber}
                            value={this.resource.requests.memory}
                            onChange={value => this.resource.requests.memory = value}
                        />
                    </Col>
                </Row>
                {this.renderAddCommand()}
                {this.renderAddArgs()}
                {this.renderEnvironment()}
                {this.renderReadyProbe()}
                {this.renderLiveProbe()}
                {this.renderLifecycle()}
            </>
        )
    }
}