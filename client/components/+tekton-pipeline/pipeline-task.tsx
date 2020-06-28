import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { _i18n } from "../../i18n";
import { TaskResources } from "client/api/endpoints/tekton-task.api";
import { Grid, Divider, Card } from "@material-ui/core";
import { TaskSpec, Params } from "../../api/endpoints/tekton-task.api";
import {
  PipelineTask,
  TaskRef,
  PipelineTaskResources,
  ParamSpec,
} from "../../api/endpoints/tekton-pipeline.api";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { Select, SelectOption } from "../select";
import { taskStore } from "../+tekton-task/task.store";
import { Icon } from "../icon";
import { isNumber } from "../input/input.validators";
import { ResourcesDetail, PipelineParamsDetails } from "../+tekton-task-detail";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

const taskRef: TaskRef = {
  name: "",
  kind: "", //Select  => Task/ClusterTask
};

const taskSpec: TaskSpec = {
  //Not fill data
};

const params: ParamSpec = {
  name: "",
};

const pipelineTaskResource: PipelineTaskResources = {
  inputs: [],
  outputs: [],
};

const pipelineTask: PipelineTask = {
  name: "",
  taskRef: taskRef,
  retries: 0,
  resources: pipelineTaskResource,
  params: params,
  timeout: "",
  //conditions not support now.
  //conditions?: PipelineTaskCondition;
};

@observer
export class PipelineTaskDetail extends React.Component<Props> {
  @observable value: PipelineTask = this.props.value || pipelineTask;

  get taskOptions() {
    const options = taskStore
      .getAllByNs("ops")
      .map((item) => ({ value: item.getName() }))
      .slice();
    return [...options];
  }

  formatOptionLabel = (option: SelectOption) => {
    const { value, label } = option;
    return (
      label || (
        <>
          <Icon small material="layers" />
          {value}
        </>
      )
    );
  };

  render() {
    return (
      <div>
        <SubTitle title={"Pipeline Task Name"} />
        <Input
          placeholder={_i18n._("Pipeline Task Name")}
          value={this.value.name}
          onChange={(value) => (this.value.name = value)}
        />
        <Select
          value={this.value.taskRef.name}
          options={this.taskOptions}
          formatOptionLabel={this.formatOptionLabel}
          onChange={(value: string) => {
            this.value.taskRef.name = value;
            // this.value.taskName = value;
            // const taskName: any = toJS(this.value.taskName);
            // this.value.taskName = taskName.value;
          }}
        />
        <Input
          required={true}
          //   placeholder={_i18n._(t`retries`)}
          type="number"
          validators={isNumber}
          value={this.value.retries.toString()}
          onChange={(value) => (this.value.retries = Number(value))}
        />
        <ResourcesDetail
          value={this.value.resources}
          onChange={(value) => {
            this.value.resources = value;
          }}
        />

        <PipelineParamsDetails
          value={this.value.params}
          onChange={(value) => {
            this.value.params = value;
          }}
        />
      </div>
    );
  }
}
