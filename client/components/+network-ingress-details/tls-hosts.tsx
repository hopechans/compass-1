import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";
import {Row, Col, Divider} from "antd";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class TlsHostsDetails extends React.Component<Props> {
  @observable value: string[] = this.props.value || [];

  add = () => {
    this.value.push("")
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  renderHostsAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`Hosts`)}
        material="add_circle_outline"
        onClick={(e) => {
          e.stopPropagation();
          this.add();
        }}
      />
    )
  }

  render() {
    return (
      <>
        <SubTitle className="fields-title" title="Transport Layer Security Host">{this.renderHostsAdd()}</SubTitle>
        {this.value.map((item, index) => {
          return (
            <div key={index}>
              <Row>
                <Col span="23">
                  <Input
                    className="item"
                    placeholder={_i18n._(t`host`)}
                    value={this.value[index]}
                    onChange={value => {
                      this.value[index] = value
                    }}
                  />
                </Col>
                <Col span="1">
                  <Icon
                    small
                    tooltip={<Trans>Remove Host</Trans>}
                    className="remove-icon"
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation()
                    }}
                  />
                </Col>
              </Row>
            </div>
          )
        })}
      </>
    )
  }
}