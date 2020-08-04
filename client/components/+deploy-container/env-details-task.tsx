import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {observable} from "mobx";
import {envVar, EnvVar} from "./common";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface EvnVarProps<T = any> extends Partial<EvnVarProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class EvnVarDetails extends React.Component<EvnVarProps> {
  @observable value: EnvVar[] = this.props.value || [];

  add = () => {
    this.value.push(envVar);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  rEnv(index: number) {
    return (
      <>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs={5} zeroMinWidth>
            <Input
              className="item"
              placeholder={_i18n._(t`Name`)}
              title={this.value[index].name}
              value={this.value[index].name}
              onChange={(value) => {
                this.value[index].name = value;
              }}
            />
          </Grid>
          <Grid item xs={5} zeroMinWidth>
            <Input
              className="item"
              placeholder={_i18n._(t`Value`)}
              title={this.value[index].value}
              value={this.value[index].value}
              onChange={(value) => {
                this.value[index].value = value;
              }}
            />
          </Grid>
          <Grid item xs zeroMinWidth>
            <Icon
              small
              tooltip={_i18n._(t`Remove Command`)}
              className="remove-icon"
              material="clear"
              onClick={(event) => {
                this.remove(index);
                stopPropagation(event)
              }}
            />
          </Grid>
        </Grid>
      </>
    )
  }

  render() {
    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>Environment</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        <div className="envs">
          {this.value.map((item, index) => {
            return this.rEnv(index);
          })}
        </div>
      </>
    );
  }
}
