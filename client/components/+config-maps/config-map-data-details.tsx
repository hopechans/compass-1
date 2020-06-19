import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {Data} from "./common";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class ConfigMapDataDetails extends React.Component<Props> {

  @observable value: Data[] = this.props.value || [];

  add = () => {
    this.value.push({key: "", value: ""});
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`Data`)}
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
        <SubTitle className="fields-title" title="Data">{this.renderAdd()}</SubTitle>
        <div className="Data">
          {this.value.map((item, index) => {
            return (
              <>
                <br/>
                <div key={index}>
                  <Icon
                    small
                    tooltip={<Trans>Remove Data</Trans>}
                    className="remove-icon"
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation();
                    }}
                  />
                  <SubTitle title={"Key"}/>
                  <Input
                    required={true}
                    value={this.value[index].key}
                    onChange={value => this.value[index].key = value}
                  />
                  <SubTitle title={"Value"}/>
                  <Input
                    required={true}
                    multiLine={true}
                    multiple={true}
                    value={this.value[index].value}
                    onChange={value => this.value[index].value = value}
                  />
                </div>
              </>
            )
          })}
        </div>
      </>
    )
  }
}