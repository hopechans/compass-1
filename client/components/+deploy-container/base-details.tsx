import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Select, SelectOption} from "../select";
import {Icon} from "../icon";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {isNumber} from "../input/input.validators";
import {Col, Row} from "../grid";
import {ActionMeta} from "react-select/src/types";
import {base, Base} from "./common";
import {SecretsSelect} from "../+config-secrets/secrets-select";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {t, Trans} from "@lingui/macro";

interface Props<T = any> extends Partial<Props> {
  value?: T;

  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class BaseDetails extends React.Component<Props> {

  @observable value: Base = this.props.value || base
  @observable namespace: string = '';

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

  formatOptionSelectImageAddressLabel = (option: SelectOption) => {
    const {value} = option;
    return (
      <>
        <Icon small material="layers"/>
        {value}
      </>
    );
  }

  get selectImageAddressOptions() {
    return [
      "public",
      "internal",
      "private",
    ]
  }

  render() {

    return (
      <>
        <SubTitle title={<Trans>Container Name</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Container Name`)}
          value={this.value.name}
          onChange={v => this.value.name = v}
        />
        <SubTitle title={<Trans>Image From</Trans>}/>
        <Select
          formatOptionLabel={this.formatOptionSelectImageAddressLabel}
          options={this.selectImageAddressOptions}
          value={this.value.imageFrom}
          onChange={v => {
            this.value.imageFrom = v.value;
          }}
        />
        <SubTitle title={<Trans>Image Address</Trans>}/>
        {
          this.value.imageFrom == "public" ?
            <>
              <Input
                required={true}
                placeholder={_i18n._(t`Image Address`)}
                value={this.value.image}
                onChange={v => this.value.image = v}
              />
            </> : <></>
        }
        {
          this.value.imageFrom == "internal" ?
            <>
              <Input
                required={true}
                placeholder={_i18n._(t`Image Address`)}
                value={this.value.image}
                onChange={v => this.value.image = v}
              />
            </> : <></>
        }
        {
          this.value.imageFrom == "private" ?
            <>
              <Input
                required autoFocus
                placeholder={_i18n._(t`Image Address`)}
                value={this.value.image}
                onChange={v => this.value.image = v}
              />
              <br/>
              <Row justify="space-between">
                <Col span="10">
                  <SubTitle title={<Trans>Secret Namespace</Trans>}/>
                  <NamespaceSelect
                    value={this.namespace}
                    placeholder={_i18n._(t`Secret Namespace`)}
                    themeName="light"
                    className="box grow"
                    onChange={(value) => {
                      this.namespace = value.value
                    }}
                  />
                </Col>
                {this.namespace ?
                  <Col span="10">
                    <SubTitle title={<Trans>Image Pull Secret</Trans>}/>
                    <SecretsSelect
                      required autoFocus
                      value={this.value.imagePullSecret}
                      namespace={this.namespace}
                      onChange={value => this.value.imagePullSecret = value.value}
                    />
                  </Col> : <></>
                }
              </Row>
            </> : <></>
        }
        <br/>
        <SubTitle title={<Trans>Image Pull Policy</Trans>}/>
        <Select
          required={true}
          formatOptionLabel={this.formatOptionLabel}
          options={this.selectOptions}
          value={this.value.imagePullPolicy}
          onChange={value => this.value.imagePullPolicy = value.value}
        />
        <br/>
        <Row justify="space-between">
          <Col span="10">
            <SubTitle title={<Trans>Limit CPU</Trans>}/>
            <Input
              required={true}
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
              required={true}
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
            <SubTitle title={<Trans>Required CPU</Trans>}/>
            <Input
              required={true}
              placeholder={_i18n._(t`Required CPU`)}
              type="number"
              validators={isNumber}
              value={this.value.resource.requests.cpu}
              onChange={value => this.value.resource.requests.cpu = value}
            />
          </Col>
          <Col span="10">
            <SubTitle title={<Trans>Required Memory</Trans>}/>
            <Input
              required={true}
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