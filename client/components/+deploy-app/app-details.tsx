import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {t, Trans} from "@lingui/macro";
import {Select, SelectOption} from "../select";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {Icon} from "../icon";
import {observable} from "mobx";
import {app, App} from "./common";
import {systemName} from "../input/input.validators";

interface Props<T = any> extends Partial<Props> {
  showIcons?: boolean;
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class AppDetails extends React.Component<Props> {

  @observable value: App = this.props.value || app;

  get typeOptions() {
    return [
      "Stone",
      // "Water",
      // "Deployment",
      // "Statefulset"
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

  render() {
    return (
      <>
        <SubTitle title={<Trans>App Type</Trans>}/>
        <Select
          formatOptionLabel={this.formatOptionLabel}
          options={this.typeOptions}
          value={this.value.type}
          onChange={v => this.value.type = v}
        />
        <SubTitle title={<Trans>App Name</Trans>}/>
        <Input
          autoFocus required
          validators={systemName}
          placeholder={_i18n._(t`Name`)}
          value={this.value.name}
          onChange={v => this.value.name = v}
        />
      </>
    )
  }
}