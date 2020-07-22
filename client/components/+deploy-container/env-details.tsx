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
import {Divider, Row, Col} from "antd";
import {SecretsSelect} from "../+config-secrets/secrets-select";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {ConfigMapsSelect} from "../+config-maps/config-maps-select";
import {ConfigMapsKeySelect} from "../+config-maps/config-maps-key-select";
import {SecretKeySelect} from "../+config-secrets/secret-key-select";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class EnvironmentDetails extends React.Component<Props> {

  @observable value: Environment[] = this.props.value || environment;
  @observable namespace: string = "";

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
      // "Custom",
      "ConfigMaps",
      "Secrets",
      // "Other"
    ]
  }

  add = () => {
    this.value.push({
      type: "ConfigMaps",
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
        <SubTitle className="fields-title" title={<Trans>Environment</Trans>}>{this.renderAdd()}</SubTitle>
        <div className="Environment">
          {this.value.map((item, index) => {
            return (
              <>
                <div key={index}>
                  <Icon
                    small
                    tooltip={_i18n._(t`Remove Environment`)}
                    className="remove-icon"
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation();
                    }}
                  />
                  <SubTitle title={<Trans>Environment Type</Trans>}/>
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
                        <SubTitle title={<Trans>Environment</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Environment`)}
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
                    this.value[index].type == "ConfigMaps" ?
                      <>
                        <SubTitle title={<Trans>Environment</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Environment`)}
                          value={this.value[index].envConfig.name}
                          onChange={value => this.value[index].envConfig.name = value}
                        />
                        <br/>

                        <Row justify="space-between">
                          <Col span="10">
                            <SubTitle title={<Trans>ConfigMap Namespace</Trans>}/>
                            <NamespaceSelect
                              required autoFocus
                              value={this.namespace}
                              onChange={value => this.namespace = value.value}
                            />
                          </Col>
                          <Col span="10">
                            <SubTitle title={<Trans>ConfigMap Name</Trans>}/>
                            <ConfigMapsSelect
                              required autoFocus
                              value={this.value[index].envConfig.configName}
                              namespace={this.namespace}
                              onChange={value => this.value[index].envConfig.configName = value.value}
                            />
                          </Col>
                        </Row>
                        <SubTitle title={<Trans>ConfigMap Key</Trans>}/>
                        <ConfigMapsKeySelect
                          required autoFocus
                          value={this.value[index].envConfig.configKey}
                          name={this.value[index].envConfig.configName}
                          onChange={value => this.value[index].envConfig.configKey = value.value}
                        />
                      </> : <></>
                  }
                  {
                    this.value[index].type == "Secrets" ?
                      <>
                        <SubTitle title={<Trans>Environment</Trans>}/>
                        <Input
                          required={true}
                          placeholder={_i18n._(t`Environment`)}
                          value={this.value[index].envConfig.name}
                          onChange={value => this.value[index].envConfig.name = value}
                        />
                        <br/>
                        <Row justify="space-between">
                          <Col span="10">
                            <SubTitle title={<Trans>Secret Namespace</Trans>}/>
                            <NamespaceSelect
                              required autoFocus
                              value={this.namespace}
                              onChange={value => this.namespace = value.value}
                            />
                          </Col>
                          <Col span="10">
                            <SubTitle title={<Trans>Secret Name</Trans>}/>
                            <SecretsSelect
                              required autoFocus
                              value={this.value[index].envConfig.secretName}
                              namespace={this.namespace}
                              onChange={value => this.value[index].envConfig.secretName = value.value}
                            />
                          </Col>
                        </Row>
                        <SubTitle title={<Trans>Secret Key</Trans>}/>
                        <SecretKeySelect
                          required autoFocus
                          value={this.value[index].envConfig.secretKey}
                          name={this.value[index].envConfig.secretName}
                          onChange={value => this.value[index].envConfig.secretKey = value.value}
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