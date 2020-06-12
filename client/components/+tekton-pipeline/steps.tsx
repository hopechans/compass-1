import { ActionMeta } from "react-select/src/types";
import { observer } from "mobx-react";
import React from "react";
import { Button } from "../button";
import { Collapse, Popconfirm } from "antd";
import { observable } from "mobx";
import { DeleteOutlined } from "@ant-design/icons";
import { container, Container } from "../+deploy-container/common";
import { ArgsDetails } from "../+deploy-container/args-details";
import { CommandDetails } from "../+deploy-container/command-details";
import { EnvironmentDetails } from "../+deploy-container/env-details";
import { VolumeMountDetails } from "../+deploy-container/volume-mount";
import { Input } from "../input";
import { Divider } from "@material-ui/core";

const { Panel } = Collapse;

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;

  base?: boolean;
  commands?: boolean;
  args?: boolean;
  environment?: boolean;
  readyProbe?: boolean;
  liveProbe?: boolean;
  lifeCycle?: boolean;
  divider?: true;
}

@observer
export default class Step extends React.Component<Props> {
  @observable value: Container[] = this.props.value || [container];
  @observable stepname: string;
  @observable imagename: string;

  add() {
    this.value.push(container);
  }

  remove(index: number) {
    this.value.splice(index, 1);
  }

  render() {
    const genExtra = (index: number) => {
      if (this.value.length > 1) {
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
            cancelText="No"
          >
            <DeleteOutlined
              translate
              style={{ color: "#ff4d4f" }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </Popconfirm>
        );
      }
      return <></>;
    };

    return (
      <>
        <Button primary onClick={() => this.add()}>
          <span>Add Step</span>
        </Button>
        <br />
        <br />
        <Collapse>
          {this.value.map((item, index) => {
            return (
              <Panel header={`Step`} key={index} extra={genExtra(index)}>
                <b>StepName</b>
                <Input
                  placeholder={"StepName"}
                  value={this.stepname}
                  onChange={(v) => (this.stepname = v)}
                />
                <br />
                <b>Image</b>
                <Input
                  placeholder={"Image"}
                  value={this.imagename}
                  onChange={(v) => (this.imagename = v)}
                />
                <br />
                <ArgsDetails />
                <Divider />
                <br />
                <CommandDetails />
                <Divider />
                <br />
                <EnvironmentDetails />
                <Divider />
                <br />
                <VolumeMountDetails />
                <Divider />
              </Panel>
            );
          })}
        </Collapse>
      </>
    );
  }
}
