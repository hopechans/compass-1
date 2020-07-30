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

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`AddEnv`)}
        material="add_circle_outline"
        onClick={(e) => {
          this.add();
          e.stopPropagation();
        }}
      />
    );
  }

  render() {
    return (
      <div>
        <SubTitle className="fields-title" title={<Trans>Environment</Trans>}>
          {this.renderAdd()}
        </SubTitle>
        <div className="envs">
          {this.value.map((item, index) => {
            return (
              <div key={index}>
                <Grid container spacing={5}>
                  <Grid item xs>
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
                  <Grid item xs>
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
                  <Grid item xs>
                    <Icon
                      small
                      tooltip={_i18n._(t`Remove Env`)}
                      className="remove-icon"
                      material="remove_circle_outline"
                      onClick={(e) => {
                        this.remove(index);
                        e.stopPropagation();
                      }}
                    />
                  </Grid>
                </Grid>
                <br/>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
