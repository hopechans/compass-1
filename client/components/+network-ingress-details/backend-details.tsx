import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";
import {backend, Backend} from "./common";
import {ServicesSelect} from "../+network-services/services-select";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class BackendDetails extends React.Component<Props> {

  static defaultProps = {value: backend}

  @observable value: Backend = this.props.value || backend

  render() {
    return (
      <>
        <SubTitle title={"serviceName"}/>
        <ServicesSelect
          value={this.value.serviceName}
          onChange={value => this.value.serviceName = value.value}
        />
        <SubTitle title={"servicePort"}/>
        <Input
          required={true}
          value={this.value.servicePort}
          onChange={value => this.value.servicePort = value}
        />
      </>
    )
  }
}