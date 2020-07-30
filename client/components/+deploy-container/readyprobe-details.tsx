import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {Checkbox} from "../checkbox";
import {isNumber} from "../input/input.validators";
import {Select, SelectOption} from "../select";
import {Probe, readyProbe} from "./common";
import {Grid} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class ReadyprobeDetails extends React.Component<Props> {

  @observable value: Probe = this.props.value || readyProbe;

  get selectOptions() {
    return [
      "HTTP",
      "TCP",
      "Command",
    ];
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
      <div>
        <Checkbox
          theme="light"
          label={<Trans>Readiness Probe</Trans>}
          value={this.value.status}
          onChange={v => this.value.status = v}
        />
        {this.value.status ?
          <div>
            <Grid container spacing={5}>
              <Grid item xs>
                <SubTitle title={<Trans>Timeout</Trans>}/>
                <Input
                  placeholder={_i18n._(t`Timeout`)}
                  type="number"
                  validators={isNumber}
                  value={this.value.timeout}
                  onChange={value => this.value.timeout = value}
                />
                <SubTitle title={<Trans>Period</Trans>}/>
                <Input
                  placeholder={_i18n._(t`Period`)}
                  type="number"
                  validators={isNumber}
                  value={this.value.cycle}
                  onChange={value => this.value.cycle = value}
                />
              </Grid>
              <Grid container spacing={5}>
                <Grid item xs>
                  <SubTitle title={<Trans>Failure</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`Failure`)}
                    type="number"
                    validators={isNumber}
                    value={this.value.retryCount}
                    onChange={value => this.value.retryCount = value}
                  />
                </Grid>
                <Grid item xs>
                  <SubTitle title={<Trans>Initial Delay</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`Initial Delay`)}
                    type="number"
                    validators={isNumber}
                    value={this.value.delay}
                    onChange={value => this.value.delay = value}
                  />
                </Grid>
              </Grid>
            </Grid>
            <SubTitle title={<Trans>Pattern Type</Trans>}/>
            <Select
              formatOptionLabel={this.formatOptionLabel}
              options={this.selectOptions}
              value={this.value.pattern.type}
              onChange={value => this.value.pattern.type = value.value}
            />
            {this.value.pattern.type == "HTTP" ?
              <div>
                <br/>
                <Grid container spacing={5}>
                  <Grid item xs>
                    <SubTitle title={<Trans>HTTP</Trans>}/>
                    <Input
                      placeholder={_i18n._(t`HTTP`)}
                      type="number"
                      validators={isNumber}
                      value={this.value.pattern.httpPort}
                      onChange={value => this.value.pattern.httpPort = value}
                    />
                  </Grid>
                  <Grid item xs>
                    <SubTitle title={<Trans>URL</Trans>}/>
                    <Input
                      placeholder={_i18n._(t`URL`)}
                      value={this.value.pattern.url}
                      onChange={value => this.value.pattern.url = value}
                    />
                  </Grid>
                </Grid>
              </div> : null}
            {this.value.pattern.type == "TCP" ?
              <div>
                <SubTitle title={<Trans>TCP</Trans>}/>
                <Input
                  placeholder={_i18n._(t`TCP`)}
                  type="number"
                  validators={isNumber}
                  value={this.value.pattern.tcpPort}
                  onChange={value => this.value.pattern.tcpPort = value}
                />
              </div> : null}
            {this.value.pattern.type == "Command" ?
              <div>
                <SubTitle title={<Trans>Command</Trans>}/>
                <Input
                  placeholder={_i18n._(t`Command`)}
                  multiLine={true}
                  maxRows={5}
                  value={this.value.pattern.command}
                  onChange={value => this.value.pattern.command = value}
                />
              </div> : null}
          </div> : null
        }
      </div>
    )
  }
}