import React from "react";
import {observer} from "mobx-react";
import {ActionMeta} from "react-select/src/types";
import {themeStore} from "../../theme.store";
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
    divider?: true;
}

@observer
export class ContainerDetails extends React.Component<ContainerProps> {

    private theme = this.props.themeName || themeStore.activeTheme.type;
    private divider = this.props.divider;

    base: Base = {
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
    commands: string[] = [];
    args: string[] = [];
    environment: Environment[] = [];
    readyProbe: Probe = {
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
    liveProbe: Probe = {
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
    lifeCycle: LifeCycle = {
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

    @observable value = this.props.value || {
        base: this.base,
        commands: this.commands,
        args: this.args,
        oneEnvConfig: this.environment,
        readyProbe: this.readyProbe,
        liveProbe: this.liveProbe,
        lifeCycle: this.lifeCycle
    }

    render() {
        const {base, commands, args, environment, readyProbe, liveProbe, lifeCycle} = this.props;

        return (
            <>
                {base ?
                    <BaseDetails
                        themeName={this.theme}
                        value={this.value.base}
                        onChange={(value) => {
                            this.value.base = value
                        }}
                    /> : <></>
                }

                {commands ?
                    <CommandDetails
                        themeName={this.theme}
                        value={this.value.commands}
                        divider={this.divider}
                        onChange={(value) => this.value.commands = value}
                    /> : <></>
                }

                {args ?
                    <ArgsDetails
                        themeName={this.theme}
                        value={this.value.args}
                        divider={this.divider}
                        onChange={(value) => this.value.args = value}
                    /> : <></>
                }

                {environment ?
                    <EnvironmentDetails
                        themeName={this.theme}
                        value={this.value.environment}
                        divider={this.divider}
                        onChange={(value) => this.value.environment = value}
                    /> : <></>
                }

                {readyProbe ?
                    <ReadyProbeDetails
                        themeName={this.theme}
                        value={this.value.readyProbe}
                        divider={this.divider}
                        onChange={(value) => this.value.readyProbe = value}
                    /> : <></>
                }
                {liveProbe ?
                    <LiveProbeDetails
                        themeName={this.theme}
                        value={this.value.liveProbe}
                        divider={this.divider}
                        onChange={(value) => this.value.liveProbe = value}
                    /> : <></>
                }
                {lifeCycle ?
                    <LifeCycleDetails
                        themeName={this.theme}
                        value={this.value.lifeCycle}
                        divider={this.divider}
                        onChange={(value) => this.value.lifeCycle = value}
                    /> : <></>
                }
            </>
        )
    }
}