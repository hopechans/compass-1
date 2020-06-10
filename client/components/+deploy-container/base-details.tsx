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

    lowerCase?: boolean
    containerNameTitle?: string
    imageAddressTitle?: string
    imagePullPolicyTitle?: string
    limitCPUTitle?: string
    limitMemoryTitle?: string
    requiredCPUTitle?: string
    requireMemoryTitle?: string
    setImagePullPolicy?: boolean
    setImageAddress?: boolean
    setResource?: boolean

    themeName?: "dark" | "light" | "outlined";
    divider?: true;

    onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class BaseDetails extends React.Component<Props> {

    static defaultProps = {
        lowerCase: true,
        containerNameTitle: 'ContainerName',
        imageAddressTitle: 'ImageAddress',
        imagePullPolicyTitle: 'ImagePullPolicy',
        limitCPUTitle: 'Limit CPU',
        limitMemoryTitle: 'Limit Memory',
        requiredCPUTitle: 'Required CPU',
        requireMemoryTitle: 'Required Memory'
    }

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

        const { lowerCase, containerNameTitle, imageAddressTitle, imagePullPolicyTitle,
            limitCPUTitle, limitMemoryTitle, requiredCPUTitle, requireMemoryTitle } = this.props

        return (
            <>
                {lowerCase?<b>{containerNameTitle}</b>:<SubTitle title={containerNameTitle}/>}
                <Input
                    placeholder={_i18n._(containerNameTitle)}
                    value={this.value.name}
                    onChange={v => this.value.name = v}
                />
                {lowerCase?<><br/><b>{imageAddressTitle}</b></>:<SubTitle title={imageAddressTitle}/>}
                <Input
                    placeholder={_i18n._(imageAddressTitle)}
                    value={this.value.image}
                    onChange={v => this.value.image = v}
                />
                {lowerCase?<><br/><b>{imagePullPolicyTitle}</b><br/><br/></>:<SubTitle title={imagePullPolicyTitle}/>}
                <Select
                    formatOptionLabel={this.formatOptionLabel}
                    options={this.selectOptions}
                    value={this.value.imagePullPolicy}
                    onChange={value => this.value.imagePullPolicy = value}
                />
                <br/>
                <Row justify="space-between">
                    <Col span="10">
                        {lowerCase?<><br/><b>{limitCPUTitle}</b></>:<SubTitle title={limitCPUTitle}/>}
                        <Input
                            placeholder={_i18n._(limitCPUTitle)}
                            type="number"
                            validators={isNumber}
                            value={this.value.resource.limits.cpu}
                            onChange={value => this.value.resource.limits.cpu = value}
                        />
                    </Col>
                    <Col span="10">
                        {lowerCase?<><br/><b>{limitMemoryTitle}</b></>:<SubTitle title={limitMemoryTitle}/>}
                        <Input
                            placeholder={_i18n._(limitMemoryTitle)}
                            type="number"
                            validators={isNumber}
                            value={this.value.resource.limits.memory}
                            onChange={value => this.value.resource.limits.memory = value}
                        />
                    </Col>
                </Row>
                <Row justify="space-between">
                    <Col span="10">
                        {lowerCase?<><br/><b>{requiredCPUTitle}</b></>:<SubTitle title={requiredCPUTitle}/>}
                        <Input
                            placeholder={_i18n._(requiredCPUTitle)}
                            type="number"
                            validators={isNumber}
                            value={this.value.resource.requests.cpu}
                            onChange={value => this.value.resource.requests.cpu = value}
                        />
                    </Col>
                    <Col span="10">
                        {lowerCase?<><br/><b>{requireMemoryTitle}</b></>:<SubTitle title={requireMemoryTitle}/>}
                        <Input
                            placeholder={_i18n._(requireMemoryTitle)}
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