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
} from "../../api/endpoints";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { Select, SelectOption } from "../select";
import { taskStore } from "../+tekton-task/task.store";
import { Icon } from "../icon";
import { ResourcesDetail, ParamsDetails } from "../+tekton-common";
import { TaskSelect } from "./task-select";
import { Grid, Divider } from "@material-ui/core";
import {
  MutilPipelineResource,
  PipelineTaskWorkSpaces,
} from "../+tekton-common";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  namespace?: string;
  divider?: true;
  disable?: boolean;
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
  workspaces: [],
};

@observer
export class PipelineTaskDetail extends React.Component<Props> {
  static defaultProps = {
    divider: false,
    disable: false,
    namespace: "",
  };
  @observable value: PipelineTask = this.props.value || pipelineTask;
  @observable tasks = observable.array<String>([], { deep: false });

  get taskOptions() {
    return [
      ...taskStore
        .getAllByNs(this.props.namespace)
        .map((item) => ({ value: item.getName() }))
        .slice()
    ];
  }

  formatOptionLabel = (option: SelectOption) => {
    const { value, label } = option;
    return (label || (<><Icon small material="layers" /> {value} </>));
  };

  render() {
    const { disable } = this.props;
    const unwrapTasks = (options: SelectOption[]) => options.map((option) => option.value);

    return (
      <div>
        <Grid container spacing={1}>
          <Grid xs={2}><SubTitle title={"Name:"} /></Grid>

          <Grid xs={10}>
            <Input
              disabled={disable}
              placeholder={_i18n._("Pipeline Task Name")}
              value={this.value.name}
              onChange={(value) => (this.value.name = value)}
            />
          </Grid>
          <br />

          <Grid xs={2}>
            <SubTitle title={"Reference:"} />
          </Grid>
          <Grid xs={10}>
            <Select
              value={this.value?.taskRef?.name}
              isDisabled={disable}
              options={this.taskOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={(value: string) => { this.value.taskRef.name = value }}
            />
          </Grid>
          <br />

          <Grid xs={2}>
            <SubTitle title={"RunAfter:"} />
          </Grid>
          <Grid xs={10}>
            <TaskSelect
              isMulti
              isDisabled={disable}
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
        <br />
        <ParamsDetails
          disable={disable}
          value={this.value?.params}
          onChange={(value) => {
            this.value.params = value;
          }}
        />
        <br />
        <PipelineTaskWorkSpaces
          value={this.value?.workspaces}
          onChange={(value) => {
            this.value.workspaces = value;
          }}
        />
        <br />
        <MutilPipelineResource
          disable={disable}
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
