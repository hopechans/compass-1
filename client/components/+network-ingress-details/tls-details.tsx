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
import { BackendDetails } from "./backend-details";
import { Input } from "../input";
import { SecretsSelect } from "../+config-secrets/secrets-select";
import { NamespaceSelect } from "../+namespaces/namespace-select";

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

                  <SubTitle title={"Tls Hosts"} />
                  {this.value[index].hosts.map((hostItem, hostIndex) => {
                    <div key={index}>
                      <Row>
                        <Col span="23">
                          <Input
                            className="item"
                            placeholder={_i18n._(t`host`)}
                            value={this.value[index].hosts[hostIndex]}
                            onChange={value => {
                              this.value[index].hosts[hostIndex] = value
                            }}
                          />
                        </Col>
                        <Col span="1">
                          <Icon
                            small
                            tooltip={<Trans>Remove Command</Trans>}
                            className="remove-icon"
                            material="remove_circle_outline"
                            onClick={(e) => {
                              this.remove(hostIndex);
                              e.stopPropagation()
                            }}
                          />
                        </Col>
                      </Row>
                    </div>
                  })}

                  <SubTitle title={"Tls Secret Namespace"} />
                  <NamespaceSelect
                    required autoFocus
                    value={this.namespace}
                    onChange={value => this.namespace = value.value}
                  />
                  <SubTitle title={"Tls Secret Name"} />
                  <SecretsSelect
                    required autoFocus
                    value={this.value[index].secretName}
                    namespace={this.namespace}
                    onChange={value => this.value[index].secretName = value.value}
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