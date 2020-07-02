import { observer } from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  WorkspacesDetails,
  PipelineResourceDetails,
} from "../+tekton-task-detail";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { PipelineSpec } from "../../api/endpoints";
import { MultiPipelineTaskStepDetails } from "./multi-pipeline-task-ref-details";
import { Divider } from "@material-ui/core";
import { pipelineTask } from "./pipeline-task";
import { systemName } from "../input/input.validators";

interface Props<T = any> extends Partial<Props> {
  value?: T;

  onChange?(option: T, meta?: ActionMeta): void;

  themeName?: "dark" | "light" | "outlined";
}

export interface PipelineResult extends PipelineSpec {
  pipelineName: string;
}

export const pipeline: PipelineResult = {
  pipelineName: "",
  resources: [],
  tasks: [pipelineTask],
  params: [],
  workspaces: [],
};

@observer
export class PipelineDetails extends React.Component<Props> {
  @observable value: PipelineResult = this.props.value || pipeline;

  render() {
    return (
      <div>
        <SubTitle title={"Pipeline Name"} />
        <Input
          value={this.value.pipelineName}
          validators={systemName}
          onChange={(value) => (this.value.pipelineName = value)}
        />
        <br />
        <PipelineParamsDetails
          value={this.value.params}
          onChange={(value) => {
            this.value.params = value;
          }}
        />
        <Divider />
        <br />
        <PipelineResourceDetails
          value={this.value.resources}
          onChange={(value) => {
            this.value.resources = value;
          }}
        />
        <Divider />
        <br />
        <WorkspacesDetails
          value={this.value.workspaces}
          onChange={(value) => {
            this.value.workspaces = value;
          }}
        />
        <Divider />
        <br />
        <MultiPipelineTaskStepDetails
          value={this.value.tasks}
          onChange={(value) => {
            this.value.tasks = value;
          }}
        />
        <br />
      </div>
    );
  }
}
