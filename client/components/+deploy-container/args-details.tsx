import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {observable} from "mobx";
import {args} from "./common";
import {Grid} from "@material-ui/core";

interface ArgsProps<T = any> extends Partial<ArgsProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class ArgsDetails extends React.Component<ArgsProps> {

  @observable value: string[] = this.props.value || args;

  add = () => {
    this.value.push("");
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`Add Arguments`)}
        material="add_circle_outline"
        onClick={(e) => {
          this.add();
          e.stopPropagation()
        }}
      />
    )
  }

  render() {

    return (
      <div>
        <SubTitle className="fields-title" title={<Trans>Arguments</Trans>}>{this.renderAdd()}</SubTitle>
        <div className="args">
          {this.value.map((item, index) => {
            return (
              <div key={index}>
                <Grid container spacing={5}>
                  <Grid item xs>
                    <Input
                      className="item"
                      placeholder={_i18n._(t`Arguments`)}
                      title={this.value[index]}
                      value={this.value[index]}
                      onChange={value => {
                        this.value[index] = value
                      }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Icon
                      small
                      tooltip={_i18n._(t`Remove Arguments`)}
                      className="remove-icon"
                      material="remove_circle_outline"
                      onClick={(e) => {
                        this.remove(index);
                        e.stopPropagation()
                      }}
                    />
                  </Grid>
                </Grid>
                <br/>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}