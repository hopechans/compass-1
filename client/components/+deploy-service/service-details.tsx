import React from "react";
import { observer } from "mobx-react";
import { Col, Collapse, Row } from "antd";
import { SubTitle } from "../layout/sub-title";
import { t, Trans } from "@lingui/macro";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { _i18n } from "../../i18n";
import { Input } from "../input";
import { isNumber } from "../input/input.validators";
import { observable } from "mobx";
import { deployPort, deployService, Service } from "./common";
import { ActionMeta } from "react-select/src/types";

const { Panel } = Collapse;


export interface Props<T = any> extends Partial<Props> {
    value?: T;
    showIcons?: boolean;
    themeName?: "dark" | "light" | "outlined";

    onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class DeployServiceDetails extends React.Component<Props> {

    @observable value: Service = this.props.value || deployService;

    formatOptionLabel = (option: SelectOption) => {
        const { showIcons } = this.props;
        const { value, label } = option;
        return label || (
            <>
                {showIcons && <Icon small material="layers" />}
                {value}
            </>
        );
    }

    get typeOptions() {
        return [
            "NodePort",
            "ClusterIP",
            "LoadBalancer",
        ]
    }

    get protocolOptions() {
        return [
            "TCP",
            "UDP"
        ]
    }

    add() {
        this.value.ports.push(deployPort)
    }

    remove(index: number) {
        this.value.ports.splice(index, 1);
    }

    render() {
        return (
            <>
                <SubTitle title={<Trans>Service Type</Trans>} />
                <Select
                    formatOptionLabel={this.formatOptionLabel}
                    options={this.typeOptions}
                    value={this.value.type}
                    onChange={v => {
                        this.value.type = v.value
                    }}
                />
                <SubTitle compact className="fields-title" title="Ports">
                    <Icon
                        small
                        tooltip={_i18n._(t`Ports`)}
                        material="add_circle_outline"
                        onClick={(e) => {
                            this.add();
                            e.stopPropagation();
                        }}
                    />
                </SubTitle>
                <div className="ports">
                    {this.value.ports.map((item, index) => {
                        return (
                            <div key={index}>
                                <br />
                                <Row>
                                    <Col>
                                        <Icon
                                            small
                                            tooltip={<Trans>Remove Command</Trans>}
                                            className="remove-icon"
                                            material="remove_circle_outline"
                                            onClick={(e) => {
                                                this.remove(index);
                                                e.stopPropagation()
                                            }}
                                        />
                                    </Col>
                                    <Col offset={1}><p>---------------- {index + 1} ----------------</p></Col>
                                </Row>
                                <SubTitle title={<Trans>Name</Trans>} />
                                <Input
                                    className="item"
                                    required={true}
                                    placeholder={_i18n._(t`Name`)}
                                    title={this.value.ports[index].name}
                                    value={this.value.ports[index].name}
                                    onChange={value => {
                                        this.value.ports[index].name = value
                                    }}
                                />
                                <SubTitle title={<Trans>Protocol</Trans>} />
                                <Select
                                    formatOptionLabel={this.formatOptionLabel}
                                    options={this.protocolOptions}
                                    value={this.value.ports[index].protocol}
                                    onChange={v => {
                                        this.value.ports[index].protocol = v.value;
                                    }}
                                />
                                <br />
                                <Row>
                                    <Col span={10}>
                                        <SubTitle title={<Trans>Port</Trans>} />
                                        <Input
                                            required={true}
                                            placeholder={_i18n._(t`Port`)}
                                            type="number"
                                            validators={isNumber}
                                            value={this.value.ports[index].port}
                                            onChange={value => this.value.ports[index].port = value}
                                        />
                                    </Col>
                                    <Col span={10} offset={4}>
                                        <SubTitle title={<Trans>TargetPort</Trans>} />
                                        <Input
                                            required={true}
                                            placeholder={_i18n._(t`TargetPort`)}
                                            type="number"
                                            validators={isNumber}
                                            value={this.value.ports[index].targetPort}
                                            onChange={value => this.value.ports[index].targetPort = value}
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
}