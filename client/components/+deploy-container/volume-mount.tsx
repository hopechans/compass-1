import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {observable} from "mobx";
import {Col, Row, Popconfirm} from "antd";
import {Divider} from 'antd';
import {args, VolumeMounts, volumeMount, volumeMounts} from "./common";

interface ArgsProps<T = any> extends Partial<ArgsProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class VolumeMountDetails extends React.Component<ArgsProps> {

  @observable value: VolumeMounts = this.props.value || volumeMounts;

  add = () => {
    this.value.items.push(volumeMount);
  }

  remove = (index: number) => {
    this.value.items.splice(index, 1);
  }

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`VolumeMount`)}
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
        <SubTitle className="fields-title" title={<Trans>VolumeMounts</Trans>}>{this.renderAdd()}</SubTitle>
        <div className="volumeMounts">
          {this.value.items.map((item, index) => {
            return (
              <div key={index}>
                <Row justify="space-between">
                  <Col span="10">
                    <Input
                      required={true}
                      placeholder={_i18n._(t`Name eg: volumeClaims name`)}
                      value={this.value.items[index].name}
                      onChange={value => this.value.items[index].name = value}
                    />
                  </Col>
                  <Col span="10">
                    <Input
                      required={true}
                      placeholder={_i18n._(t`MountPath eg: /data`)}
                      value={this.value.items[index].mountPath}
                      onChange={
                        value => this.value.items[index].mountPath = value
                      }
                    />
                  </Col>
                  <Icon
                    small
                    tooltip={<Trans>Remove MountPath</Trans>}
                    className="remove-icon"
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation()
                    }}
                  />
                </Row>
              </div>
            )
          })}
        </div>
      </>
    )
  }
}