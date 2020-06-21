import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { ActionMeta } from "react-select/src/types";
import { Tls, tls } from "./common";
import { Divider, Row, Col } from "antd";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { Input } from "../input";
import { SecretsSelect } from "../+config-secrets/secrets-select";
import { NamespaceSelect } from "../+namespaces/namespace-select";
import { Button } from "../button/button";
import { TlsHostsDetails } from "./tls-hosts";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
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
        <Button primary onClick={() => this.add()}><span>Add Tls</span></Button>
        <br />
        <br />

        <div className="Tls">
          {this.value.map((item, tlsIndex) => {
            return (
              <>
                <div key={tlsIndex}>
                  <Icon
                    small
                    tooltip={<Trans>Remove Tls</Trans>}
                    className="remove-icon"
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(tlsIndex);
                      e.stopPropagation();
                    }}
                  />
                  <br /> <br />

                  <TlsHostsDetails
                    divider={true}
                    value={this.value[tlsIndex].hosts}
                    onChange={value => this.value[tlsIndex].hosts = value}
                  />

                  <SubTitle title={"Tls Secret Namespace"} />
                  <NamespaceSelect
                    required autoFocus
                    value={this.namespace}
                    onChange={value => this.namespace = value.value}
                  />
                  <SubTitle title={"Tls Secret Name"} />
                  <SecretsSelect
                    required autoFocus
                    value={this.value[tlsIndex].secretName}
                    namespace={this.namespace}
                    onChange={value => this.value[tlsIndex].secretName = value.value}
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