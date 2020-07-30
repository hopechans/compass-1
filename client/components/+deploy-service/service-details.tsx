import "./service-details.scss";

import React from "react";
import {observer} from "mobx-react";
import {SubTitle} from "../layout/sub-title";
import {t, Trans} from "@lingui/macro";
import {Select, SelectOption} from "../select";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {Input} from "../input";
import {isNumber} from "../input/input.validators";
import {observable} from "mobx";
import {deployPort, deployService, Service} from "./common";
import {ActionMeta} from "react-select/src/types";
import {Tab, Tabs, AppBar, Paper, Badge, Divider, Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export interface Props<T = any> extends Partial<Props> {
  value?: T;
  showIcons?: boolean;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class DeployServiceDetails extends React.Component<Props> {

  @observable value: Service = this.props.value || deployService;
  @observable Index: number = 0;

  formatOptionLabel = (option: SelectOption) => {
    const {showIcons} = this.props;
    const {value, label} = option;
    return label || (
      <div>
        {showIcons && <Icon small material="layers"/>}
        {value}
      </div>
    );
  }

  get typeOptions() {
    return [
      "ClusterIP",
      "NodePort",
      "LoadBalancer",
    ]
  }

  get protocolOptions() {
    return [
      "TCP",
      "UDP"
    ]
  }

  add() {
    this.value.ports.push(deployPort)
  }

  remove(index: number) {
    this.value.ports.splice(index, 1);
  }

  render() {

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      this.Index = newValue
    }

    return (
      <div>
        <SubTitle title={<Trans>Service Type</Trans>}/>
        <Select
          formatOptionLabel={this.formatOptionLabel}
          options={this.typeOptions}
          value={this.value.type}
          onChange={v => {
            this.value.type = v.value
          }}
        />
        <br/>
        <Badge color="secondary"
               badgeContent={this.value.ports.length}
               onClick={(evt) => {
                 this.add();
                 stopPropagation(evt)
               }}>
          Ports
        </Badge>

        <br/>
        <br/>

        <div style={{width: "100%", flexGrow: 1}}>

          <AppBar position={"static"} color={"default"}>
            <Badge color="primary" badgeContent={this.value.ports.length} anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}>
              <Tabs
                variant={"scrollable"}
                value={this.Index}
                aria-label="scrollable auto tabs"
                scrollButtons="auto"
                style={{backgroundColor: "white"}}
                onChange={handleChange}
              >
                {this.value.ports.map((item, index) => {
                  return (
                    <Tab label={"Ports " + this.value.ports[index].name} fullWidth={true}/>
                  )
                })}
              </Tabs>
            </Badge>
          </AppBar>
          <Divider variant="inset" />
          {this.value.ports.map((item, index) => {
            return (
              <div
                role="tabpanel"
                hidden={this.Index !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
              >
                <Paper style={{padding: 25}} elevation={5}>
                  <SubTitle title={<Trans>Name</Trans>}/>
                  <Input
                    className="item"
                    required={true}
                    placeholder={_i18n._(t`Name`)}
                    value={this.value.ports[index].name}
                    onChange={(value) => {
                      this.value.ports[index].name = value;
                    }}
                  />
                  <SubTitle title={<Trans>Protocol</Trans>}/>
                  <Select
                    formatOptionLabel={this.formatOptionLabel}
                    options={this.protocolOptions}
                    value={this.value.ports[index].protocol}
                    onChange={v => {
                      this.value.ports[index].protocol = v.value;
                    }}
                  />
                  <br/>
                  <Grid container spacing={5}>
                    <Grid item xs>
                      <SubTitle title={<Trans>Port</Trans>}/>
                      <Input
                        required={true}
                        placeholder={_i18n._(t`Port`)}
                        type="number"
                        validators={isNumber}
                        value={this.value.ports[index].port}
                        onChange={value => this.value.ports[index].port = value}
                      />
                    </Grid>
                    <Grid item xs>
                      <SubTitle title={<Trans>TargetPort</Trans>}/>
                      <Input
                        required={true}
                        placeholder={_i18n._(t`TargetPort`)}
                        type="number"
                        validators={isNumber}
                        value={this.value.ports[index].targetPort}
                        onChange={value => this.value.ports[index].targetPort = value}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}