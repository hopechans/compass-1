import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Button} from "../button";
import {VolumeClaimDetails} from "./volumeclaim-details";
import {DeleteOutlined} from '@ant-design/icons';
import {Popconfirm} from "antd";
import {Collapse} from "../collapse"

import {volumeClaim, VolumeClaimTemplate} from "./common";
import {_i18n} from "../../i18n";
import {t} from "@lingui/macro";

export interface VolumeClaimTemplateProps<T = any> extends Partial<VolumeClaimTemplateProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class MultiVolumeClaimDetails extends React.Component<VolumeClaimTemplateProps> {

  @observable value: VolumeClaimTemplate[] = this.props.value || [volumeClaim]

  add = () => {
    this.value.push(volumeClaim)
  }

  remove = (index: number) => {
    this.value.splice(index, 1)
  }

  render() {

    const genExtra = (index: number) => {
      return (
        <Popconfirm
          title="Confirm Delete?"
          onConfirm={(event: any) => {
            event.preventDefault();
            event.stopPropagation();
            this.remove(index);
          }}
          onCancel={(event: any) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          okText="Yes"
          cancelText="No">
          <DeleteOutlined
            translate style={{color: '#ff4d4f'}}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          />
        </Popconfirm>
      )

    }

    return (
      <>
        <br/>
        <Button primary onClick={() => this.add()}><span>{_i18n._(t`Addition VolumeClaim`)}</span></Button>
        <br/><br/>
        {this.value.map((item, index) => {
          return (
            <Collapse panelName={`VolumeClaim`} extraExpand={genExtra(index)}>
              <VolumeClaimDetails
                value={this.value[index]} onChange={value => this.value[index] = value}/>
            </Collapse>
          )
        })}
      </>
    )
  }
}