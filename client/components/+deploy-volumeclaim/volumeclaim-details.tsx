import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {volumeClaim, VolumeClaimTemplate} from "./common";
import {ActionMeta} from "react-select/src/types";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {isNumber} from "../input/input.validators";

export interface VolumeClaimProps<T = any> extends Partial<VolumeClaimProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class VolumeClaimDetails extends React.Component<VolumeClaimProps> {

  @observable value: VolumeClaimTemplate = this.props.value || volumeClaim

  render() {
    return (
      <div>
        <SubTitle title={<Trans>Name</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Name`)}
          value={this.value.metadata.name}
          onChange={value => this.value.metadata.name = value}
        />
        <SubTitle title={<Trans>Request Storage Size</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Request Storage Size(MB)`)}
          type="number"
          validators={isNumber}
          value={this.value.spec.resources.requests.storage}
          onChange={value => this.value.spec.resources.requests.storage = value}
        />
      </div>
    )
  }
}