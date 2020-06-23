import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {number, t, Trans} from "@lingui/macro";
import {Col, Row} from "../grid";
import {Input} from "../input";
import {Checkbox} from "../checkbox";
import {isNumber} from "../input/input.validators";
import {Select, SelectOption} from "../select";
import {lifeCycle, LifeCycle} from "./common";
import {Divider} from 'antd';

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class LifeCycleDetails extends React.Component<Props> {

  @observable value: LifeCycle = this.props.value || lifeCycle

  get selectOptions() {
    return [
      "HTTP",
      "TCP",
      "Command",
    ]
  }

  formatOptionLabel = (option: SelectOption) => {
    const {value, label} = option;
    return label || (
      <>
        <Icon small material="layers"/>
        {value}
      </>
    );
  }

  render() {

    return (
      <>
        {this.props.divider ? <Divider/> : <></>}
        <Checkbox
          theme="light"
          label={<Trans>Lifecycle</Trans>}
          value={this.value.status}
          onChange={v => this.value.status = v}
        />
        {
          this.value.status ?
            <>
              <SubTitle title={<Trans>PostStart</Trans>}/>
              <Select
                formatOptionLabel={this.formatOptionLabel}
                options={this.selectOptions}
                value={this.value.postStart.type}
                onChange={value => this.value.postStart.type = value.value}
              />
              {this.value.postStart.type == "HTTP" ?
                <>
                  <br/>
                  <Row>
                    <Col span="10">
                      <SubTitle title={<Trans>HTTP</Trans>}/>
                      <Input
                        placeholder={_i18n._(t`HTTP`)}
                        type="number"
                        validators={isNumber}
                        value={this.value.postStart.httpPort}
                        onChange={value => this.value.postStart.httpPort = value}
                      />
                    </Col>
                    <Col span="10" offset="4">
                      <SubTitle title={<Trans>URL</Trans>}/>
                      <Input
                        placeholder={_i18n._(t`URL`)}
                        value={this.value.postStart.url}
                        onChange={value => this.value.postStart.url = value}
                      />
                    </Col>
                  </Row>
                </> : <></>}
              {this.value.postStart.type == "TCP" ?
                <>
                  <SubTitle title={<Trans>TCP</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`TCP`)}
                    type="number"
                    validators={isNumber}
                    value={this.value.postStart.tcpPort}
                    onChange={value => this.value.postStart.tcpPort = value}
                  />
                </> : <></>}
              {this.value.postStart.type == "Command" ?
                <>
                  <SubTitle title={<Trans>Command</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`Command`)}
                    multiLine={true}
                    value={this.value.postStart.command}
                    onChange={value => this.value.postStart.command = value}
                  />
                </> : <></>}
              <SubTitle title={<Trans>PreStop</Trans>}/>
              <Select
                formatOptionLabel={this.formatOptionLabel}
                options={this.selectOptions}
                value={this.value.preStop.type}
                onChange={value => this.value.preStop.type = value.value}
              />
              {this.value.preStop.type == "HTTP" ?
                <>
                  <br/>
                  <Row>
                    <Col span="10">
                      <SubTitle title={<Trans>HTTP</Trans>}/>
                      <Input
                        placeholder={_i18n._(t`HTTP`)}
                        type="number"
                        validators={isNumber}
                        value={this.value.preStop.httpPort}
                        onChange={value => this.value.preStop.httpPort = value}
                      />
                    </Col>
                    <Col span="10" offset="4">
                      <SubTitle title={<Trans>URL</Trans>}/>
                      <Input
                        placeholder={_i18n._(t`URL`)}
                        value={this.value.preStop.url}
                        onChange={value => this.value.preStop.url = value}
                      />
                    </Col>
                  </Row>
                </> : <></>}
              {this.value.preStop.type == "TCP" ?
                <>
                  <SubTitle title={<Trans>TCP</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`TCP`)}
                    type="number"
                    validators={isNumber}
                    value={this.value.preStop.tcpPort}
                    onChange={value => this.value.preStop.tcpPort = value}
                  />
                </> : <></>}
              {this.value.preStop.type == "Command" ?
                <>
                  <SubTitle title={<Trans>Command</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`Command`)}
                    multiLine={true}
                    value={this.value.preStop.command}
                    onChange={value => this.value.preStop.command = value}
                  />
                </> : <></>}
            </> : <></>
        }
      </>
    )
  }
}