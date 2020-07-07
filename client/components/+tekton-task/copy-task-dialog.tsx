import "./copy-task-dialog.scss";

import { observer } from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  MultiTaskStepDetails,
  PipelineParams,
  TaskStep,
  taskStep,
  ResourcesDetail,
  resources,
} from "../+tekton-common";
import { observable, toJS } from "mobx";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Trans, t } from "@lingui/macro";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { taskStore } from "./task.store";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { TaskResources, Task } from "../../api/endpoints";
import { Notifications } from "../notifications";
import { systemName } from "../input/input.validators";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import { configStore } from "../../config.store";
interface Props<T = any> extends Partial<Props> {
  value?: T;

  onChange?(option: T, meta?: ActionMeta): void;

  themeName?: "dark" | "light" | "outlined";
}

const theme = createMuiTheme({
  overrides: {
    MuiExpansionPanelDetails: {
      root: {
        display: "gird",
      },
    },
    MuiPaper: {
      root: {
        color: "",
      },
    },
  },
});

class Volume {
  name: string;
  emptyDir: any;
}

export interface TaskResult {
  taskName: string;
  pipelineParams: PipelineParams[];
  resources: TaskResources;
  taskSteps: TaskStep[];
  volumes?: Volume[];
}

export const task: TaskResult = {
  taskName: "",
  pipelineParams: [],
  resources: resources,
  taskSteps: [taskStep],
  volumes: [],
};

@observer
export class CopyTaskDialog extends React.Component<Props> {
  @observable prefix: string = configStore.getDefaultNamespace() || "admin";
  @observable value: TaskResult = this.props.value || task;
  @observable static isOpen = false;
  @observable static graph: any;
  @observable static node: any;
  @observable static data: any;
  @observable ifSwitch: boolean = false;

  static open(graph: any, node: any) {
    CopyTaskDialog.isOpen = true;
    this.graph = graph;
    this.node = node;
  }

  onOpen = () => {
    const group = CopyTaskDialog.node.getContainer();
    let shape = group.get("children")[2];
    const name = shape.attrs.text;
    const defaultNameSpace = "ops";
    const task = taskStore.getByName(name, defaultNameSpace);
    if (task !== undefined) {
      this.value.resources = resources;
      this.value.resources.inputs =
        task.spec.resources?.inputs == undefined
          ? []
          : task.spec.resources?.inputs;
      this.value.resources.outputs =
        task.spec.resources?.outputs == undefined
          ? []
          : task.spec.resources?.outputs;

      this.value.pipelineParams =
        task.spec.params == undefined ? [] : task.spec.params;
      const names = task.metadata.name.split("-");
      names.shift();
      this.value.taskName = names.join("-");
      this.value.taskSteps = task.spec.steps;
      this.value.volumes =
        task.spec.volumes == undefined ? [] : task.spec.volumes;
    }
  };

  static close() {
    CopyTaskDialog.isOpen = false;
  }

  close = () => {
    CopyTaskDialog.close();
  };

  handle = () => {
    this.saveTask();
    CopyTaskDialog.graph.setTaskName(this.value.taskName, CopyTaskDialog.node);
  };

  toTask() {}

  saveTask = async () => {
    const parms = toJS(this.value.pipelineParams);
    const resources = toJS(this.value.resources);
    const steps = toJS(this.value.taskSteps);

    const volumes = [
      {
        name: "build-path",
        emptyDir: {},
      },
    ];

    try {
      if (!this.ifSwitch) {
        this.value.taskName = `${this.prefix}-${this.value.taskName}`;
      }

      const task = taskStore.getByName(this.value.taskName);
      if (task === undefined) {
        await taskStore.create(
          {
            name: this.value.taskName,
            namespace: "",
            labels: new Map<string, string>().set(
              "namespace",
              configStore.getDefaultNamespace() == ""
                ? "admin"
                : configStore.getDefaultNamespace()
            ),
          },
          {
            spec: {
              params: parms,
              resources: resources,
              steps: steps,
              volumes: volumes,
            },
          }
        );
      } else {
        if (!this.ifSwitch) {
          task.metadata.name = this.value.taskName;
          task.spec.params = parms;
          task.spec.resources = resources;
          //TODO:查出来的task有些字段直接没有的。
          // let a:any = task
          // a.scirp= null;

          task.spec.steps = steps;
          await taskStore.update(task, { ...task });
        }
      }

      Notifications.ok(<>task {this.value.taskName} save successed</>);
      this.close();
    } catch (err) {
      this.value.taskName = "";
      Notifications.error(err);
    }
  };

  handleChange = (event: any) => {
    this.ifSwitch = event.target.checked;
  };

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

  get taskOptions() {
    const options = taskStore
      .getAllByNs("ops")
      .map((item) => ({ value: item.getName() }))
      .slice();
    return [...options];
  }

  render() {
    const header = (
      <h5>
        <Trans>Apply Task</Trans>
      </h5>
    );

    return (
      <ThemeProvider theme={theme}>
        <Dialog
          isOpen={CopyTaskDialog.isOpen}
          onOpen={this.onOpen}
          close={this.close}
        >
          <Wizard
            className="CopyAddDeployDialog"
            header={header}
            done={this.close}
          >
            <WizardStep contentClass="flex gaps column" next={this.handle}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      name="checkedA"
                      color="primary"
                      checked={this.ifSwitch}
                      onChange={this.handleChange}
                    />
                  }
                  label={
                    this.ifSwitch ? (
                      <SubTitle title={<Trans>Select module</Trans>} />
                    ) : (
                      <SubTitle title={<Trans>Template configuration</Trans>} />
                    )
                  }
                />
              </FormGroup>
              <div hidden={this.ifSwitch}>
                <SubTitle title={<Trans>Task Name</Trans>} />
                <Input
                  iconLeft={<b>{this.prefix}</b>}
                  required={true}
                  validators={systemName}
                  placeholder={_i18n._("Task Name")}
                  value={this.value.taskName}
                  onChange={(value) => (this.value.taskName = value)}
                />
                <br />

                <PipelineParamsDetails
                  value={this.value.pipelineParams}
                  onChange={(value) => {
                    this.value.pipelineParams = value;
                  }}
                />
                <br />
                <Divider />

                <ResourcesDetail
                  value={this.value.resources}
                  onChange={(value) => {
                    this.value.resources = value;
                  }}
                />
                <br />

                <MultiTaskStepDetails
                  value={this.value.taskSteps}
                  onChange={(value) => {
                    this.value.taskSteps = value;
                  }}
                />
              </div>
              <div hidden={!this.ifSwitch}>
                <Select
                  value={this.value.taskName}
                  options={this.taskOptions}
                  formatOptionLabel={this.formatOptionLabel}
                  onChange={(value: string) => {
                    this.value.taskName = value;
                    const taskName: any = toJS(this.value.taskName);
                    this.value.taskName = taskName.value;
                  }}
                />
              </div>
            </WizardStep>
          </Wizard>
        </Dialog>
      </ThemeProvider>
    );
  }
}
