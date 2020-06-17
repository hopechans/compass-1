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

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class ScriptDetails extends React.Component<Props> {

  static defaultProps = {value: "default"}

  @observable value: string = this.props.value || "default"

  render() {
    return (
      <div>
        <SubTitle title={"Scripts"}/>
        <Input
          required={true}
          multiLine={true}
          maxRows={10}
          placeholder={_i18n._("Scripts")}
          value={this.value}
          onChange={value => this.value = value}
        />
      </div>
    )
  }
}