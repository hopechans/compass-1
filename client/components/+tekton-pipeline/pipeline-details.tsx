import "./copy-task-dialog.scss";

import { observer } from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  WorkspacesDetails,
} from "../+tekton-task-detail";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { PipelineSpec } from "../../api/endpoints/tekton-pipeline.api";
import { ParamsDetails } from "../+tekton-task-detail";
import { PipelineTaskDetail } from "./pipeline-task";

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
  tasks: [],
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
          onChange={(value) => (this.value.pipelineName = value)}
        />
        <br />
        <ParamsDetails
          value={this.value.resources}
          onChange={(value) => (this.value.resources = value)}
        />
        <br />
        <PipelineParamsDetails
          value={this.value.params}
          onChange={(value) => {
            this.value.params = value;
          }}
        />
        <br />
        <PipelineTaskDetail
          value={this.value.tasks}
          onChange={(value) => {
            this.value.tasks = value;
          }}
        />
        <br />
        <WorkspacesDetails
          value={this.value.workspaces}
          onChange={(value) => {
            this.value.workspaces = value;
          }}
        />
        <br />
      </div>
    );
  }
}
