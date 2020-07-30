import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Select, SelectOption} from "../select";
import {Icon} from "../icon";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {isNumber} from "../input/input.validators";
import {ActionMeta} from "react-select/src/types";
import {base, Base} from "./common";
import {SecretsSelect} from "../+config-secrets/secrets-select";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {t, Trans} from "@lingui/macro";
import {Grid} from "@material-ui/core";

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
      <div>
        <Icon small material="layers"/>
        {value}
      </div>
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
      <div>

        <SubTitle title={<Trans>Container Name</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Container Name`)}
          value={this.value.name}
          onChange={v => this.value.name = v}
        />

        <br/>
        <Grid
          container
          spacing={5}
          alignItems={"center"}
          direction={"row"}
        >
          <Grid item xs>
            <SubTitle title={<Trans>Image From</Trans>}/>
            <Select
              formatOptionLabel={this.formatOptionSelectImageAddressLabel}
              options={this.selectImageAddressOptions}
              value={this.value.imageFrom}
              onChange={v => {
                this.value.imageFrom = v.value;
              }}
            />
          </Grid>
          <Grid item xs>
            <SubTitle title={<Trans>Image Pull Policy</Trans>}/>
            <Select
              required={true}
              formatOptionLabel={this.formatOptionLabel}
              options={this.selectOptions}
              value={this.value.imagePullPolicy}
              onChange={value => this.value.imagePullPolicy = value.value}
            />
          </Grid>
        </Grid>

        <br/>
        {this.value.imageFrom != "" ?
          <div>
            <SubTitle title={<Trans>Image Address</Trans>}/>
            {this.value.imageFrom == "public" ?
              <Input
                required={true}
                placeholder={_i18n._(t`Image Address`)}
                value={this.value.image}
                onChange={v => this.value.image = v}
              /> : null}
            {this.value.imageFrom == "internal" ?
              <Input
                required={true}
                placeholder={_i18n._(t`Image Address`)}
                value={this.value.image}
                onChange={v => this.value.image = v}
              /> : null}
            {this.value.imageFrom == "private" ?
              <div>
                <Input
                  required autoFocus
                  placeholder={_i18n._(t`Image Address`)}
                  value={this.value.image}
                  onChange={v => this.value.image = v}
                />
                <br/>
                <Grid container spacing={5}>
                  <Grid item xs>
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
                  </Grid>
                  {this.namespace ?
                    <Grid item xs>
                      <SubTitle title={<Trans>Image Pull Secret</Trans>}/>
                      <SecretsSelect
                        required autoFocus
                        value={this.value.imagePullSecret}
                        namespace={this.namespace}
                        onChange={value => this.value.imagePullSecret = value.value}
                      />
                    </Grid> : <div></div>
                  }
                </Grid>
              </div> : null}
          </div> : null
        }

        <br/>
        <Grid container spacing={5}>
          <Grid item xs>
            <SubTitle title={<Trans>Limit CPU</Trans>} children={
              <Input
                required={true}
                placeholder={_i18n._(t`Limit CPU`)}
                type="number"
                validators={isNumber}
                value={this.value.resource.limits.cpu}
                onChange={value => this.value.resource.limits.cpu = value}
              />
            }/>
          </Grid>
          <Grid item xs>
            <SubTitle title={<Trans>Limit Memory</Trans>} children={
              <Input
                required={true}
                placeholder={_i18n._(t`Limit Memory`)}
                type="number"
                validators={isNumber}
                value={this.value.resource.limits.memory}
                onChange={value => this.value.resource.limits.memory = value}
              />
            }/>
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs>
            <SubTitle title={<Trans>Required CPU</Trans>} children={
              <Input
                required={true}
                placeholder={_i18n._(t`Required CPU`)}
                type="number"
                validators={isNumber}
                value={this.value.resource.requests.cpu}
                onChange={value => this.value.resource.requests.cpu = value}
              />
            }/>
          </Grid>
          <Grid item xs>
            <SubTitle title={<Trans>Required Memory</Trans>} children={
              <Input
                required={true}
                placeholder={_i18n._(t`Require Memory`)}
                type="number"
                validators={isNumber}
                value={this.value.resource.requests.memory}
                onChange={value => this.value.resource.requests.memory = value}
              />
            }/>
          </Grid>
        </Grid>
      </div>
    )
  }
}