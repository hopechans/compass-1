import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { TaskResources } from "client/api/endpoints/tekton-task.api";
import { TaskResourceDetails } from "./task-resource-details";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class ResourcesDetail extends React.Component<Props> {
  @observable value: TaskResources = this.props.value || { inputs: [], outputs: [] };

  render() {
    return (
      <>
        <TaskResourceDetails
          value={this.value.inputs}
          title={"Resource Inputs"}
          onChange={(value) => {
            this.value.inputs = value;
          }}
        />
        <br/>
        <TaskResourceDetails
          value={this.value.outputs}
          title={"Resource Outputs"}
          onChange={(value) => {
            this.value.outputs = value;
          }}
        />
      </>
    );
  }
}
