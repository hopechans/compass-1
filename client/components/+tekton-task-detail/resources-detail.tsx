import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { resources } from "./common";
import { TaskResources } from "client/api/endpoints/tekton-task.api";
import { TaskResourceDetails } from "./task-resource-details";
import { Divider } from "@material-ui/core";
import { PipelineTaskInputResourceDetail } from "./pipeline-task-resources-details";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

export const defaultTaskResources: TaskResources = {
  inputs: [],
  outputs: [],
};

@observer
export class ResourcesDetail extends React.Component<Props> {
  @observable value: TaskResources = this.props.value || defaultTaskResources;

  render() {
    console.log("----------------------------->Value:", this.value);
    return (
      <div>
        <PipelineTaskInputResourceDetail
          value={this.value.inputs}
          title={"Resource Inputs"}
          onChange={(value) => {
            console.log("----------------------------->Inputs:", value);
            this.value.inputs = value;
          }}
        />

        <Divider />

        <PipelineTaskInputResourceDetail
          value={this.value.outputs}
          title={"Resource Outputs"}
          onChange={(value) => {
            console.log("----------------------------->Outputs:", value);
            this.value.outputs = value;
          }}
        />
        <Divider />
      </div>
    );
  }
}
