import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Button} from "../button";
import {VolumeClaimDetails} from "./volumeclaim-details";
import {DeleteOutlined} from '@ant-design/icons';
import {Collapse, Popconfirm} from "antd";

const {Panel} = Collapse;

import {volumeClaim, VolumeClaimTemplate} from "./common";

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
        <Button primary onClick={() => this.add()}><span>Addition VolumeClaim</span></Button>
        <br/><br/>
        <Collapse>
          {this.value.map((item, index) => {
            return (
              <Panel header={`VolumeClaim`} key={index} extra={genExtra(index)}>
                <VolumeClaimDetails
                  value={this.value[index]} onChange={value => this.value[index] = value}/>
              </Panel>
            )
          })}
        </Collapse>
      </>
    )
  }
}