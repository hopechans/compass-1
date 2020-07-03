import { observer } from "mobx-react";
import React from "react";
import { observable, toJS } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { _i18n } from "../../i18n";
import {
  PipelineTask,
  TaskRef,
  PipelineTaskResources,
  Param,
} from "../../api/endpoints/tekton-pipeline.api";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { Select, SelectOption } from "../select";
import { taskStore } from "../+tekton-task/task.store";
import { Icon } from "../icon";
import { ResourcesDetail, ParamsDetails } from "../+tekton-task-detail";
import { TaskSelect } from "./task-select";
import { Grid, Divider } from "@material-ui/core";
import { MutilPipelineResource } from "../+tekton-task-detail";
interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

export const taskRef: TaskRef = {
  name: "",
  kind: "", //Select  => Task/ClusterTask
};

export const params: Param[] = [];

export const pipelineTaskResource: PipelineTaskResources = {
  inputs: [],
  outputs: [],
};

export const pipelineTask: PipelineTask = {
  name: "",
  taskRef: taskRef,
  resources: pipelineTaskResource,
  params: params,
  timeout: "",
  runAfter: [],
  retries: 0,
  //conditions not support now.
  //conditions?: PipelineTaskCondition;
};

@observer
export class PipelineTaskDetail extends React.Component<Props> {
  @observable value: PipelineTask = this.props.value || pipelineTask;
  @observable tasks = observable.array<String>([], { deep: false });

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
    const unwrapTasks = (options: SelectOption[]) =>
      options.map((option) => option.value);
    console.log(
      "---------------------------->：this.value.resources",
      this.value
    );
    return (
      <div>
        <Grid container spacing={1}>
          <Grid xs={2}>
            <SubTitle title={"Name:"} />
          </Grid>
          <Grid xs={10}>
            <Input
              placeholder={_i18n._("Pipeline Task Name")}
              value={this.value.name}
              onChange={(value) => (this.value.name = value)}
            />
            <br />
          </Grid>
          <Grid xs={2}>
            <SubTitle title={"Ref:"} />
          </Grid>
          <Grid xs={10}>
            <Select
              value={this.value?.taskRef?.name}
              options={this.taskOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={(value: string) => {
                this.value.taskRef.name = value;
              }}
            />
            <br />
          </Grid>

          <Grid xs={2}>
            <SubTitle title={"RunAfter:"} />
          </Grid>
          <Grid xs={10}>
            <TaskSelect
              isMulti
              value={this.value.runAfter}
              themeName="light"
              className="box grow"
              onChange={(opts: SelectOption[]) => {
                if (!opts) opts = [];
                this.tasks.replace(unwrapTasks(opts));
                let data: any = toJS(this.tasks);
                this.value.runAfter = data;
              }}
            />
            <br />
          </Grid>

          <Grid xs={2}>
            <SubTitle title={"Retries:"} />
          </Grid>
          <Grid xs={10}>
            <Input
              placeholder={_i18n._("retries")}
              value={this.value?.retries?.toString()}
              onChange={(value) => (this.value.retries = Number(value))}
            />
            <br />
          </Grid>

          <Grid xs={2}>
            <SubTitle title={"Timeout:"} />
          </Grid>
          <Grid xs={10}>
            <Input
              placeholder={_i18n._("timeout")}
              value={this.value?.timeout?.toString()}
              onChange={(value) => (this.value.timeout = value)}
            />
            <br />
          </Grid>
        </Grid>
        <Divider />
        <br />

        <ParamsDetails
          value={this.value?.params}
          onChange={(value) => {
            this.value.params = value;
          }}
        />
        <br />
        <MutilPipelineResource
          value={this.value?.resources}
          onChange={(value) => {
            this.value.resources = value;
          }}
        />
        <br />
      </div>
    );
  }
}
