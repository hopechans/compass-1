import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";
import {Tls, tls} from "./common";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {SecretsSelect} from "../+config-secrets/secrets-select";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {Button} from "../button";
import {TlsHostsDetails} from "./tls-hosts";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class TlsDetails extends React.Component<Props> {

  @observable value: Tls[] = this.props.value || [tls];
  @observable namespace: string = "";

  add = () => {
    this.value.push(tls);
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
        <Button primary onClick={() => this.add()}><span>Add Transport Layer Security</span></Button>
        <div className="Tls">
          {this.value.map((item, index) => {
            return (
              <div key={index}>
                <br/>
                <Icon
                  small
                  tooltip={<Trans>Remove Tls</Trans>}
                  className="remove-icon"
                  material="remove_circle_outline"
                  onClick={(e) => {
                    this.remove(index);
                    e.stopPropagation();
                  }}
                />
                <TlsHostsDetails
                  divider={true}
                  value={this.value[index].hosts}
                  onChange={value => this.value[index].hosts = value}
                />
                <SubTitle title={"Transport Layer Security Namespace"}/>
                <NamespaceSelect
                  required autoFocus
                  value={this.namespace}
                  onChange={value => this.namespace = value.value}
                />
                <SubTitle title={"Transport Layer Security Secret Name"}/>
                <SecretsSelect
                  required autoFocus
                  value={this.value[index].secretName}
                  namespace={this.namespace}
                  onChange={value => this.value[index].secretName = value.value}
                />
              </div>
            )
          })}
        </div>
      </>
    )
  }
}