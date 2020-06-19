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

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class TlsDetails extends React.Component<Props> {

  @observable value: string[] = this.props.value || []

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
        tooltip={_i18n._(t`Tls`)}
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
        <SubTitle className="fields-title" title="Transport Layer Security">{this.renderAdd()}</SubTitle>
        <div className="Tls">
          {this.value.map((item, index) => {
            return (
              <>
                <div key={index}>
                  <Icon
                    small
                    tooltip={<Trans>Remove Secret Name</Trans>}
                    className="remove-icon"
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation();
                    }}
                  />
                  <SubTitle title={"Secret Name"}/>
                  <Input
                    required={true}
                    value={this.value[index]}
                    onChange={value => this.value[index] = value}
                  />
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