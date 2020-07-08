import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {observable} from "mobx";
import {Col, Row} from "../grid";
import {Divider} from 'antd';
import {args} from "./common";

interface ArgsProps<T = any> extends Partial<ArgsProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class ArgsDetails extends React.Component<ArgsProps> {

  @observable value: string[] = this.props.value || args;

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
        tooltip={_i18n._(t`Add Arguments`)}
        material="add_circle_outline"
        onClick={(e) => {
          this.add();
          e.stopPropagation()
        }}
      />
    )
  }

  render() {

    return (
      <>
        {this.props.divider ? <Divider/> : <></>}
        <SubTitle className="fields-title" title={<Trans>Arguments</Trans>}>{this.renderAdd()}</SubTitle>
        <div className="args">
          {this.value.map((item, index) => {
            return (
              <div key={index}>
                <Row>
                  <Col span="23">
                    <Input
                      className="item"
                      placeholder={_i18n._(t`Arguments`)}
                      title={this.value[index]}
                      value={this.value[index]}
                      onChange={value => {
                        this.value[index] = value
                      }}
                    />
                  </Col>
                  <Col span="1">
                    <Icon
                      small
                      tooltip={_i18n._(t`Remove Arguments`)}
                      className="remove-icon"
                      material="remove_circle_outline"
                      onClick={(e) => {
                        this.remove(index);
                        e.stopPropagation()
                      }}
                    />
                  </Col>
                </Row>
                <br/>
              </div>
            )
          })}
        </div>
      </>
    )
  }
}