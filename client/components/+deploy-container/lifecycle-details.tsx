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
import {isNumber, isUrl} from "../input/input.validators";
import {Select, SelectOption} from "../select";
import {lifeCycle, LifeCycle} from "./common";
import {Grid} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
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
      <div>
        <Icon small material="layers"/>
        {value}
      </div>
    );
  }

  render() {

    return (
      <div>
        <Checkbox
          theme="light"
          label={<Trans>Lifecycle</Trans>}
          value={this.value.status}
          onChange={v => this.value.status = v}
        />
        {
          this.value.status ?
            <div>
              <SubTitle title={<Trans>PostStart</Trans>}/>
              <Select
                formatOptionLabel={this.formatOptionLabel}
                options={this.selectOptions}
                value={this.value.postStart.type}
                onChange={value => this.value.postStart.type = value.value}
              />
              {this.value.postStart.type == "HTTP" ?
                <div>
                  <br/>
                  <Grid container spacing={5}>
                    <Grid item xs>
                      <SubTitle title={<Trans>HTTP</Trans>}/>
                      <Input
                        placeholder={_i18n._(t`HTTP`)}
                        type="number"
                        validators={isNumber}
                        value={this.value.postStart.httpPort}
                        onChange={value => this.value.postStart.httpPort = value}
                      />
                    </Grid>
                    <Grid item xs>
                      <SubTitle title={<Trans>URL</Trans>}/>
                      <Input
                        placeholder={_i18n._(t`URL`)}
                        value={this.value.postStart.url}
                        onChange={value => this.value.postStart.url = value}
                      />
                    </Grid>
                  </Grid>
                </div> : <div></div>}
              {this.value.postStart.type == "TCP" ?
                <div>
                  <SubTitle title={<Trans>TCP</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`TCP`)}
                    type="number"
                    validators={isNumber}
                    value={this.value.postStart.tcpPort}
                    onChange={value => this.value.postStart.tcpPort = value}
                  />
                </div> : <div></div>}
              {this.value.postStart.type == "Command" ?
                <div>
                  <SubTitle title={<Trans>Command</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`Command`)}
                    multiLine={true}
                    value={this.value.postStart.command}
                    onChange={value => this.value.postStart.command = value}
                  />
                </div> : <div></div>}
              <SubTitle title={<Trans>PreStop</Trans>}/>
              <Select
                formatOptionLabel={this.formatOptionLabel}
                options={this.selectOptions}
                value={this.value.preStop.type}
                onChange={value => this.value.preStop.type = value.value}
              />
              {this.value.preStop.type == "HTTP" ?
                <div>
                  <br/>
                  <Grid container spacing={5}>
                    <Grid item xs>
                      <SubTitle title={<Trans>HTTP</Trans>}/>
                      <Input
                        placeholder={_i18n._(t`HTTP`)}
                        type="number"
                        validators={isNumber}
                        value={this.value.preStop.httpPort}
                        onChange={value => this.value.preStop.httpPort = value}
                      />
                    </Grid>
                    <Grid item xs>
                      <SubTitle title={<Trans>URL</Trans>}/>
                      <Input
                        placeholder={_i18n._(t`URL`)}
                        validators={isUrl}
                        value={this.value.preStop.url}
                        onChange={value => this.value.preStop.url = value}
                      />
                    </Grid>
                  </Grid>
                </div> : <div></div>}
              {this.value.preStop.type == "TCP" ?
                <div>
                  <SubTitle title={<Trans>TCP</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`TCP`)}
                    type="number"
                    validators={isNumber}
                    value={this.value.preStop.tcpPort}
                    onChange={value => this.value.preStop.tcpPort = value}
                  />
                </div> : <div></div>}
              {this.value.preStop.type == "Command" ?
                <div>
                  <SubTitle title={<Trans>Command</Trans>}/>
                  <Input
                    placeholder={_i18n._(t`Command`)}
                    multiLine={true}
                    value={this.value.preStop.command}
                    onChange={value => this.value.preStop.command = value}
                  />
                </div> : <div></div>}
            </div> : <div></div>
        }
      </div>
    )
  }
}