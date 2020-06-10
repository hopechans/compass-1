import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Select, SelectOption} from "../select";
import {Input} from "../input";
import {observable} from "mobx";
import {environment, Environment} from "./common";
import {Divider} from "antd";

interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";
    divider?: true;

    lowerCase?: boolean;

    onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class EnvironmentDetails extends React.Component<Props> {

    static defaultProps = {
        lowerCase: true
    }

    @observable value: Environment[] = this.props.value || environment;

    formatOptionLabel = (option: SelectOption) => {
        const {value} = option;
        return (
            <>
                <Icon small material="layers"/>
                {value}
            </>
        );
    }

    get selectOptions() {
        return [
            "Custom Environment",
            "From Configuration",
            "From Secret",
            "Other"
        ]
    }

    add = () => {
        this.value.push({
            type: "Custom Environment",
            oneEnvConfig: {}
        });
    }

    remove = (index: number) => {
        this.value.splice(index, 1);
    }

    renderAdd() {
        return (
            <Icon
                small
                tooltip={_i18n._(t`Environment`)}
                material="add_circle_outline"
                onClick={(e) => {
                    this.add();
                    e.stopPropagation();
                }}
            />
        )
    }

    render() {

        const {lowerCase} = this.props;

        return (
            <>
                {this.props.divider ? <Divider/> : <></>}
                {lowerCase?
                    <><b>Environment  </b>{this.renderAdd()}<br/><br/></>:
                    <SubTitle className="fields-title" title="Environment">{this.renderAdd()}</SubTitle>}
                <div className="Environment">
                    {this.value.map((item, index) => {
                        return (
                            <>
                                <div key={index}>
                                    <Icon
                                        small
                                        tooltip={<Trans>Remove Environment</Trans>}
                                        className="remove-icon"
                                        material="remove_circle_outline"
                                        onClick={(e) => {
                                            this.remove(index);
                                            e.stopPropagation();
                                        }}
                                    />
                                    <br/><br/>
                                    <Select
                                        formatOptionLabel={this.formatOptionLabel}
                                        options={this.selectOptions}
                                        value={this.value[index].type}
                                        onChange={v => {
                                            this.value[index].type = v.value;
                                        }}
                                    />
                                    {
                                        this.value[index].type == "Custom Environment" ?
                                            <>
                                                {lowerCase?<><br/><b>Name</b><br/><br/></>:<SubTitle title={<Trans>Name</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Name`)}
                                                    value={this.value[index].oneEnvConfig.name}
                                                    onChange={value => this.value[index].oneEnvConfig.name = value}
                                                />
                                                {lowerCase?<><br/><b>Value</b><br/><br/></>:<SubTitle title={<Trans>Value</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Value`)}
                                                    value={this.value[index].oneEnvConfig.value}
                                                    onChange={value => this.value[index].oneEnvConfig.value = value}
                                                />
                                            </> : <></>
                                    }
                                    {
                                        this.value[index].type == "From Configuration" ?
                                            <>
                                                {lowerCase?<><br/><b>Environment</b><br/><br/></>:<SubTitle title={<Trans>Environment</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Environment`)}
                                                    value={this.value[index].oneEnvConfig.value}
                                                    onChange={value => this.value[index].oneEnvConfig.value = value}
                                                />
                                                {lowerCase?<><br/><b>Configure</b><br/><br/></>:<SubTitle title={<Trans>Configure</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Configure`)}
                                                    value={this.value[index].oneEnvConfig.configure}
                                                    onChange={
                                                        value => this.value[index].oneEnvConfig.configure = value
                                                    }
                                                />
                                                {lowerCase?<><br/><b>Key</b><br/><br/></>:<SubTitle title={<Trans>Key</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Key`)}
                                                    value={this.value[index].oneEnvConfig.key}
                                                    onChange={value => this.value[index].oneEnvConfig.key = value}
                                                />
                                            </> : <></>
                                    }
                                    {
                                        this.value[index].type == "From Secret" ?
                                            <>
                                                {lowerCase?<><br/><b>Name</b><br/><br/></>:<SubTitle title={<Trans>Name</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Name`)}
                                                    value={this.value[index].oneEnvConfig.name}
                                                    onChange={value => this.value[index].oneEnvConfig.name = value}
                                                />
                                                {lowerCase?<><br/><b>Secret Name</b><br/><br/></>:<SubTitle title={<Trans>Secret Name</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Secret Name`)}
                                                    value={this.value[index].oneEnvConfig.selectName}
                                                    onChange={value => this.value[index].oneEnvConfig.selectName = value}
                                                />
                                                {lowerCase?<><br/><b>Secret Key</b><br/><br/></>:<SubTitle title={<Trans>Secret Key</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Secret Key`)}
                                                    value={this.value[index].oneEnvConfig.selectKey}
                                                    onChange={value => this.value[index].oneEnvConfig.selectKey = value}
                                                />
                                            </> : <></>
                                    }
                                    {
                                        this.value[index].type == "Other" ?
                                            <>
                                                {lowerCase?<><br/><b>Command</b><br/><br/></>:<SubTitle title={<Trans>Command</Trans>}/>}
                                                <Input
                                                    placeholder={_i18n._(t`Command`)}
                                                    multiLine={true}
                                                    maxRows={5}
                                                    value={this.value[index].oneEnvConfig.enterCommand}
                                                    onChange={value => this.value[index].oneEnvConfig.enterCommand = value}
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
}