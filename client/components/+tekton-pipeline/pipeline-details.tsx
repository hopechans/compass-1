import "./copy-task-dialog.scss";

import { observer } from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  WorkspacesDetails,
} from "../+tekton-task-detail";
import { observable, toJS } from "mobx";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Trans } from "@lingui/macro";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { taskStore } from "../+tekton-task/task.store";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { TaskResources, Task } from "../../api/endpoints/tekton-task.api";
import { PipelineSpec } from "../../api/endpoints/tekton-pipeline.api";
import { ParamsDetails } from "../+tekton-task-detail";
import { PipelineTaskDetail } from "./pipeline-task";

interface Props<T = any> extends Partial<Props> {
  value?: T;

  onChange?(option: T, meta?: ActionMeta): void;

  themeName?: "dark" | "light" | "outlined";
}

class Volume {
  name: string;
  emptyDir: any;
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
          // placeholder={_i18n._("Pipeline Task Name")}
          value={this.value.pipelineName}
          onChange={(value) => (this.value.pipelineName = value)}
        />
        <ParamsDetails
          value={this.value.resources}
          onChange={(value) => (this.value.resources = value)}
        />
        <PipelineParamsDetails
          value={this.value.params}
          onChange={(value) => {
            this.value.params = value;
          }}
        />
        <PipelineTaskDetail
          value={this.value.tasks}
          onChange={(value) => {
            this.value.tasks = value;
          }}
        />
        <WorkspacesDetails
          value={this.value.workspaces}
          onChange={(value) => {
            this.value.workspaces = value;
          }}
        />
      </div>
    );
  }
}
