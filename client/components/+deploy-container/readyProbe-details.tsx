import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Col, Row} from "antd";
import {Input} from "../input";
import {Checkbox} from "../checkbox";
import {isNumber} from "../input/input.validators";
import {Select, SelectOption} from "../select";
import {Probe, readyProbe} from "./common";
import {Divider} from 'antd';

interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";
    divider?: true;

    onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class ReadyProbeDetails extends React.Component<Props> {

    @observable value: Probe = this.props.value || readyProbe;

    get selectOptions() {
        return [
            "HTTP",
            "TCP",
            "Command",
        ];
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

    render() {
        return (
            <>
                {this.props.divider ? <Divider/> : <></>}
                <Checkbox
                    theme="light"
                    label={<Trans>Readiness Probe</Trans>}
                    value={this.value.status}
                    onChange={v => this.value.status = v}
                />
                {
                    this.value.status ?
                        <>
                            <Row>
                                <Col span="10">
                                    <SubTitle title={<Trans>Timeout</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Timeout`)}
                                        type="number"
                                        validators={isNumber}
                                        value={this.value.timeout}
                                        onChange={value => this.value.timeout = value}
                                    />
                                    <SubTitle title={<Trans>Period</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Period`)}
                                        type="number"
                                        validators={isNumber}
                                        value={this.value.cycle}
                                        onChange={value => this.value.cycle = value}
                                    />
                                </Col>
                                <Col span="10" offset="4">
                                    <SubTitle title={<Trans>Failure</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`Failure`)}
                                        type="number"
                                        validators={isNumber}
                                        value={this.value.retryCount}
                                        onChange={value => this.value.retryCount = value}
                                    />
                                    <SubTitle title={<Trans>InitialDelay</Trans>}/>
                                    <Input
                                        placeholder={_i18n._(t`InitialDelay`)}
                                        type="number"
                                        validators={isNumber}
                                        value={this.value.delay}
                                        onChange={value => this.value.delay = value}
                                    />
                                </Col>
                            </Row>
                            <br/>
                            <Select
                                formatOptionLabel={this.formatOptionLabel}
                                options={this.selectOptions}
                                value={this.value.pattern.type}
                                onChange={value => this.value.pattern.type = value.value}
                            />
                            {
                                this.value.pattern.type == "HTTP" ?
                                    <>
                                        <br/>
                                        <Row>
                                            <Col span="10">
                                                <SubTitle title={<Trans>HTTP</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`HTTP`)}
                                                    type="number"
                                                    validators={isNumber}
                                                    value={this.value.pattern.httpPort}
                                                    onChange={value => this.value.pattern.httpPort = value}
                                                />
                                            </Col>
                                            <Col span="10" offset="4">
                                                <SubTitle title={<Trans>URL</Trans>}/>
                                                <Input
                                                    placeholder={_i18n._(t`URL`)}
                                                    value={this.value.pattern.url}
                                                    onChange={value => this.value.pattern.url = value}
                                                />
                                            </Col>
                                        </Row>
                                    </> : <></>
                            }
                            {
                                this.value.pattern.type == "TCP" ?
                                    <>
                                        <SubTitle title={<Trans>TCP</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`TCP`)}
                                            type="number"
                                            validators={isNumber}
                                            value={this.value.pattern.tcpPort}
                                            onChange={value => this.value.pattern.tcpPort = value}
                                        />
                                    </> : <></>
                            }
                            {
                                this.value.pattern.type == "Command" ?
                                    <>
                                        <SubTitle title={<Trans>Command</Trans>}/>
                                        <Input
                                            placeholder={_i18n._(t`Command`)}
                                            multiLine={true}
                                            maxRows={5}
                                            value={this.value.pattern.command}
                                            onChange={value => this.value.pattern.command = value}
                                        />
                                    </> : <></>
                            }
                        </> : <></>
                }
            </>
        )
    }
}