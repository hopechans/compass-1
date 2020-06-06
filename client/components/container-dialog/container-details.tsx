import React from "react";
import {observer} from "mobx-react";
import {Select, SelectOption, SelectProps} from "../select";
import {ActionMeta} from "react-select/src/types";
import {themeStore} from "../../theme.store";
import {autobind} from "../../utils";
import {EnvironmentDetails} from "./env-details";
import {BaseDetails} from "./base-details";
import {CommandDetails} from "./command-details";
import {ReadyProbeDetails} from "./readyProbe-details"
import {LiveProbeDetails} from "./liveProbe-details";
import {LifeCycleDetails} from "./lifecycle-details";
import {ArgsDetails} from "./args-details";
import {observable} from "mobx";
import {Base, Environment, LifeCycle, Probe} from "./common";

export interface ContainerProps<T = any> extends Partial<ContainerProps> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(option: T, meta?: ActionMeta): void;

    base?: boolean;
    commands?: boolean;
    args?: boolean;
    environment?: boolean;
    readyProbe?: boolean;
    liveProbe?: boolean;
    lifeCycle?: boolean;
    divider?:true;
}

@observer
export class ContainerDetails extends React.Component<ContainerProps> {

    private theme = this.props.themeName || themeStore.activeTheme.type;
    private divider = this.props.divider;

    @observable base: Base = {
        name:  "default",
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
    @observable commands: string[] = [];
    @observable args: string[] = [];
    @observable environment: Environment[] = [];
    @observable readyProbe: Probe = {
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
    @observable liveProbe: Probe = {
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
    @observable lifeCycle: LifeCycle = {
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

    @observable value = {
        name: this.base.name ,
        image: this.base.image,
        imagePullPolicy: this.base.imagePullPolicy,
        resource: this.base.resource,
        commands: this.commands,
        oneEnvConfig: this.environment.map(item => item.oneEnvConfig),
        readyProbe: this.readyProbe,
        liveProbe: this.liveProbe,
        lifeCycle: this.lifeCycle
    }

    @autobind()
    onChange(meta: ActionMeta) {
        if (this.props.onChange) {
            this.props.onChange(this.value, meta);
        }
    }

    render() {
        const {base, commands, args, environment, readyProbe, liveProbe, lifeCycle} = this.props;

        return (
            <>
                {base ?
                    <BaseDetails
                        themeName={this.theme}
                        value={this.base}
                        onChange={(value) => {console.log(value)}}
                    /> : <></>
                }

                {commands ?
                    <CommandDetails
                        themeName={this.theme}
                        value={this.commands}
                        divider={this.divider}
                        onChange={(value) => this.commands = value}
                    /> : <></>
                }

                {args ?
                    <ArgsDetails
                        themeName={this.theme}
                        value={this.args}
                        divider={this.divider}
                        onChange={(value) => this.args = value}
                    /> : <></>
                }

                {environment ?
                    <EnvironmentDetails
                        themeName={this.theme}
                        value={this.environment}
                        divider={this.divider}
                        onChange={(value) => this.environment = value}
                    /> : <></>
                }

                {readyProbe ?
                    <ReadyProbeDetails
                        themeName={this.theme}
                        value={this.readyProbe}
                        divider={this.divider}
                        onChange={(value) => this.readyProbe = value}
                    /> : <></>
                }
                {liveProbe ?
                    <LiveProbeDetails
                        themeName={this.theme}
                        value={this.liveProbe}
                        divider={this.divider}
                        onChange={(value) => this.liveProbe = value}
                    /> : <></>
                }
                {lifeCycle ?
                    <LifeCycleDetails
                        themeName={this.theme}
                        value={this.lifeCycle}
                        divider={this.divider}
                        onChange={(value) => this.lifeCycle = value}
                    /> : <></>
                }
            </>
        )
    }
}