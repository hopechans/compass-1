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

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class EnvironmentDetails extends React.Component<Props> {

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
      "Custom",
      "Configuration",
      "Secret",
      "Other"
    ]
  }

  add = () => {
    this.value.push({
      type: "Custom",
      envConfig: {}
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

    return (
      <>
        {this.props.divider ? <Divider/> : <></>}
        <SubTitle className="fields-title" title="Environment">{this.renderAdd()}</SubTitle>
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
                    this.value[index].type == "Custom" ?
                      <>
                        <SubTitle title={<Trans>Name</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Name`)}
                          value={this.value[index].envConfig.name}
                          onChange={value => this.value[index].envConfig.name = value}
                        />
                        <SubTitle title={<Trans>Value</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Value`)}
                          value={this.value[index].envConfig.value}
                          onChange={value => this.value[index].envConfig.value = value}
                        />
                      </> : <></>
                  }
                  {
                    this.value[index].type == "Configuration" ?
                      <>
                        <SubTitle title={<Trans>Environment</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Environment`)}
                          value={this.value[index].envConfig.name}
                          onChange={value => this.value[index].envConfig.name = value}
                        />
                        <SubTitle title={<Trans>Configure</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Configure`)}
                          value={this.value[index].envConfig.configName}
                          onChange={
                            value => this.value[index].envConfig.configName = value
                          }
                        />
                        <SubTitle title={<Trans>Key</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Key`)}
                          value={this.value[index].envConfig.configKey}
                          onChange={value => this.value[index].envConfig.configKey = value}
                        />
                      </> : <></>
                  }
                  {
                    this.value[index].type == "Secret" ?
                      <>
                        <SubTitle title={<Trans>Name</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Name`)}
                          value={this.value[index].envConfig.name}
                          onChange={value => this.value[index].envConfig.name = value}
                        />
                        <SubTitle title={<Trans>Secret Name</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Secret Name`)}
                          value={this.value[index].envConfig.secretName}
                          onChange={value => this.value[index].envConfig.secretName = value}
                        />
                        <SubTitle title={<Trans>Secret Key</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Secret Key`)}
                          value={this.value[index].envConfig.secretKey}
                          onChange={value => this.value[index].envConfig.secretKey = value}
                        />
                      </> : <></>
                  }
                  {
                    this.value[index].type == "Other" ?
                      <>
                        <SubTitle title={<Trans>Command</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Command`)}
                          multiLine={true}
                          maxRows={5}
                          value={this.value[index].envConfig.enterCommand}
                          onChange={value => this.value[index].envConfig.enterCommand = value}
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