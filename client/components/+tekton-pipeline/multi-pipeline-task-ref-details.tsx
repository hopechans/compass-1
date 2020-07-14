import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Popconfirm } from "antd";
import { Collapse } from "../collapse";
import { DeleteOutlined } from "@ant-design/icons";
import { PipelineTask } from "../../api/endpoints";
import { PipelineTaskDetail, pipelineTask } from "./pipeline-task";
import { Trans } from "@lingui/macro";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: boolean;
  disable?: boolean;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class MultiPipelineTaskStepDetails extends React.Component<Props> {

  static defaultProps = {
    divider: false,
    disable: false,
  }

  @observable value: PipelineTask[] = this.props.value || [];

  add() {
    this.value.push(pipelineTask);
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  render() {

    const {disable} = this.props;

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
              translate
              style={{ color: "#ff4d4f" }}
              onClick={(event: any) => {
                event.stopPropagation();
              }}
            />
          </Popconfirm>
        );
      }
      return <></>;
    };

    return (
      <div>
        {this.value.length > 0 ? (
          this.value.map((item, index) => {
            return (
              <Collapse
                panelName={<Trans>Task</Trans>}
                extraExpand={!disable? genExtra(index) : null}
              >
                <PipelineTaskDetail
                  disable={disable}
                  value={this.value[index]}
                  onChange={(value) => (this.value[index] = value)}
                />
              </Collapse>
            );
          })
        ) : (
          <></>
        )}
      </div>
    );
  }
}
