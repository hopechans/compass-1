import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Select, SelectOption} from "../select";
import {Icon} from "../icon";
import {SubTitle} from "../layout/sub-title";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {isNumber} from "../input/input.validators";
import {Col, Row} from "antd";
import {ActionMeta} from "react-select/src/types";
import {base, Base} from "./common";

interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";
    divider?: true;

    onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class BaseDetails extends React.Component<Props> {

    @observable value: Base = this.props.value || base

    formatOptionLabel = (option: SelectOption) => {
        const {value, label} = option;
        return label || (
            <>
                <Icon small material="layers"/>
                {value}
            </>
        );
    }

    get selectOptions() {
        return [
            "IfNotPresent",
            "Always",
            "Never",
        ];
    }

    render() {
        return (
            <>
                <SubTitle title={<Trans>ContainerName</Trans>}/>
                <Input
                    placeholder={_i18n._(t`ContainerName`)}
                    value={this.value.name}
                    onChange={v => this.value.name = v}
                />
                <SubTitle title={<Trans>ImageAddress</Trans>}/>
                <Input
                    placeholder={_i18n._(t`ImageAddress`)}
                    value={this.value.image}
                    onChange={v => this.value.image = v}
                />
                <SubTitle title={<Trans>ImagePullPolicy</Trans>}/>
                <Select
                    formatOptionLabel={this.formatOptionLabel}
                    options={this.selectOptions}
                    value={this.value.imagePullPolicy}
                    onChange={value => this.value.imagePullPolicy = value}
                />
                <br/>
                <Row justify="space-between">
                    <Col span="10">
                        <SubTitle title={<Trans>Limit CPU</Trans>}/>
                        <Input
                            placeholder={_i18n._(t`Limit CPU`)}
                            type="number"
                            validators={isNumber}
                            value={this.value.resource.limits.cpu}
                            onChange={value => this.value.resource.limits.cpu = value}
                        />
                    </Col>
                    <Col span="10">
                        <SubTitle title={<Trans>Limit Memory</Trans>}/>
                        <Input
                            placeholder={_i18n._(t`Limit Memory`)}
                            type="number"
                            validators={isNumber}
                            value={this.value.resource.limits.memory}
                            onChange={value => this.value.resource.limits.memory = value}
                        />
                    </Col>
                </Row>
                <Row justify="space-between">
                    <Col span="10">
                        <SubTitle title={<Trans>Require CPU</Trans>}/>
                        <Input
                            placeholder={_i18n._(t`Required CPU`)}
                            type="number"
                            validators={isNumber}
                            value={this.value.resource.requests.cpu}
                            onChange={value => this.value.resource.requests.cpu = value}
                        />
                    </Col>
                    <Col span="10">
                        <SubTitle title={<Trans>Require Memory</Trans>}/>
                        <Input
                            placeholder={_i18n._(t`Require Memory`)}
                            type="number"
                            validators={isNumber}
                            value={this.value.resource.requests.memory}
                            onChange={value => this.value.resource.requests.memory = value}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}