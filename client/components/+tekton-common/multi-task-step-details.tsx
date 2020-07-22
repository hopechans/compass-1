import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Collapse} from "../collapse";
import {Popconfirm} from "antd";
import {Button} from "../button";
import {DeleteOutlined} from '@ant-design/icons';
import {taskStep, TaskStep} from "./common";
import {TaskStepDetails} from "./task-step-details";
import {t, Trans} from "@lingui/macro";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class MultiTaskStepDetails extends React.Component<Props> {

  @observable value: TaskStep[] = this.props.value || []

  add() {
    this.value.push(taskStep)
  }

  remove = (index: number) => {
    this.value.splice(index, 1)
  }

  render() {

    const genExtra = (index: number) => {
      if (this.value.length > 1) {
        return (
          <Popconfirm
            title="Confirm Delete?"
            onConfirm={(event: any) => {
              this.remove(index);
              event.stopPropagation();
            }}
            onCancel={(event: any) => {
              event.stopPropagation();
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              translate={"yes"}
              style={{color: "#ff4d4f"}}
              onClick={(event: any) => {
                event.stopPropagation();
              }}
            />
          </Popconfirm>
        );
      }
      return <></>;
    }

    return (
      <>
        <Button primary onClick={() => this.add()}>
          <span>Add Step</span>
        </Button>
        <br/>
        <br/>
        {this.value.length > 0 ?
          this.value.map((item, index) => {
            return (
              <Collapse panelName={<Trans>Step</Trans>} extraExpand={genExtra(index)}>
                <TaskStepDetails value={this.value[index]} onChange={value => this.value[index] = value}/>
              </Collapse>
            );
          }) : <></>}
      </>
    )
  }
}