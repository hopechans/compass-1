import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";
import {backend, Backend, path, Path} from "./common";
import {Divider} from "antd";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {BackendDetails} from "./backend-details";
import {Input} from "../input";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class PathsDetails extends React.Component<Props> {

  @observable value: Path[] = this.props.value || []

  add = () => {
    this.value.push(path);
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`Paths`)}
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
        <SubTitle className="fields-title" title="HTTP.Paths">{this.renderAdd()}</SubTitle>
        <div className="Results">
          {this.value.map((item, index) => {
            return (
              <>
                <div key={index}>
                  <Icon
                    small
                    tooltip={<Trans>Remove Path</Trans>}
                    className="remove-icon"
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation();
                    }}
                  />
                  <SubTitle title={"Path"}/>
                  <Input
                    required={true}
                    value={this.value[index].path}
                    onChange={value => this.value[index].path = value}
                  />
                  <BackendDetails
                    value={this.value[index].backend}
                    onChange={value => this.value[index].backend = value}/>
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