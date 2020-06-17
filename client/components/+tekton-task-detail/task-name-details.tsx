import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class TaskNameDetails extends React.Component<Props> {

  static defaultProps = {
    value: "default"
  }

  @observable value: string = this.props.value || "default"

  render() {
    return (
      <div>
        <SubTitle title={"Task Name"}/>
        <Input
          required={true}
          placeholder={_i18n._("Task Name")}
          value={this.value}
          onChange={v => this.value = v}
        />
      </div>
    )
  }
}