import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {observable} from "mobx";
import {VolumeMounts, volumeMount, volumeMounts} from "./common";
import {Grid} from "@material-ui/core";

interface ArgsProps<T = any> extends Partial<ArgsProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class VolumeMountDetails extends React.Component<ArgsProps> {

  @observable value: VolumeMounts = this.props.value || volumeMounts;

  add = () => {
    this.value.items.push(volumeMount);
  }

  remove = (index: number) => {
    this.value.items.splice(index, 1);
  }

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`VolumeMount`)}
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
        <SubTitle className="fields-title" title={<Trans>VolumeMounts</Trans>}>{this.renderAdd()}</SubTitle>
        <div className="volumeMounts">
          {this.value.items.map((item, index) => {
            return (
              <div key={index}>
                <Grid container spacing={5}>
                  <Grid item xs>
                    <Input
                      required={true}
                      placeholder={_i18n._(t`Name eg: volumeClaims name`)}
                      value={this.value.items[index].name}
                      onChange={value => this.value.items[index].name = value}
                    />
                  </Grid>
                  <Grid item xs>
                    <Input
                      required={true}
                      placeholder={_i18n._(t`MountPath eg: /data`)}
                      value={this.value.items[index].mountPath}
                      onChange={
                        value => this.value.items[index].mountPath = value
                      }
                    />
                  </Grid>
                  <Icon
                    small
                    tooltip={<Trans>Remove MountPath</Trans>}
                    className="remove-icon"
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation()
                    }}
                  />
                </Grid>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}