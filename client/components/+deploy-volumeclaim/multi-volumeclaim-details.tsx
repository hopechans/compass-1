import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Button} from "../button";
import {Icon} from "../icon";
import {Collapse} from "../collapse"
import {volumeClaim, VolumeClaimTemplate} from "./common";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Grid, Paper} from "@material-ui/core";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {isNumber} from "../input/input.validators";
import {stopPropagation} from "../../utils";

export interface VolumeClaimTemplateProps<T = any> extends Partial<VolumeClaimTemplateProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class MultiVolumeClaimDetails extends React.Component<VolumeClaimTemplateProps> {

  @observable value: VolumeClaimTemplate[] = this.props.value || [volumeClaim]

  add = () => {
    this.value.push(volumeClaim)
  }

  remove = (index: number) => {
    this.value.splice(index, 1)
  }

  rVolumeClaim(index: number) {
    return (
      <>
        <br/>
        <Paper elevation={3} style={{padding: 25}}>
          <Grid container spacing={5} alignItems="center" direction="row">
            <Grid item xs={11} zeroMinWidth>
              <SubTitle title={<Trans>Name</Trans>}/>
              <Input
                required={true}
                placeholder={_i18n._(t`Name`)}
                value={this.value[index].metadata.name}
                onChange={value => this.value[index].metadata.name = value}
              />
              <SubTitle title={<Trans>Request Storage Size</Trans>}/>
              <Input
                required={true}
                placeholder={_i18n._(t`Request Storage Size(MB)`)}
                type="number"
                validators={isNumber}
                value={this.value[index].spec.resources.requests.storage}
                onChange={value => this.value[index].spec.resources.requests.storage = value}
              />
            </Grid>
            <Grid item xs zeroMinWidth style={{textAlign: "center"}}>
              <Icon
                style={{margin: "0.8vw, 0.9vh"}}
                small
                tooltip={_i18n._(t`Remove Environment`)}
                className="remove-icon"
                material="clear"
                onClick={(e) => {
                  this.remove(index);
                  e.stopPropagation();
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </>
    )
  }

  render() {

    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>VolumeClaim</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        {this.value.map((item, index) => {
          return (
            this.rVolumeClaim(index)
          )
        })}
      </>
    )
  }
}