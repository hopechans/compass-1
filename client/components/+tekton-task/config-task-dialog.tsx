import "./config-task-dialog.scss";

import {observer} from "mobx-react";
import React from "react";
import {
  PipelineParams,
  TaskStep,
  taskStep,
  resources, TaskSpecWorkSpaces, PipelineParamsDetails, ResourcesDetail, MultiTaskStepDetails,
} from "../+tekton-common";
import {observable, toJS} from "mobx";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {Trans, t} from "@lingui/macro";
import {taskStore} from "./task.store";

import {TaskResources, Task} from "../../api/endpoints";
import {Notifications} from "../notifications";
import {createMuiTheme} from "@material-ui/core";
import {configStore} from "../../config.store";
import {WorkspaceDeclaration as Workspace} from "../../api/endpoints/tekton-task.api";
import { ThemeProvider } from "@material-ui/core/styles";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {systemName} from "../input/input.validators";
import {_i18n} from "../../i18n";

interface Props<T = any> extends Partial<Props> {
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
  workspace?: Workspace[];
}

export const task: TaskResult = {
  taskName: "",
  pipelineParams: [],
  resources: resources,
  taskSteps: [taskStep],
  volumes: [],
  workspace: [],
};

@observer
export class ConfigTaskDialog extends React.Component<Props> {

  @observable prefix: string = configStore.getDefaultNamespace();
  @observable value: TaskResult = task;
  @observable static isOpen = false;
  @observable static Data: Task = null;
  @observable static data: any;
  @observable name: string;
  @observable change: boolean;

  static open(task: Task) {
    ConfigTaskDialog.Data = task;
    ConfigTaskDialog.isOpen = true;
  }

  get task() {
    return ConfigTaskDialog.Data;
  }

  onOpen = () => {
  };

  static close() {
    ConfigTaskDialog.isOpen = false;
  }

  close = () => {
    ConfigTaskDialog.close();
  };

  handle = () => {
    this.saveTask();
  };

  saveTask = async () => {
    const parms = toJS(this.value.pipelineParams);
    const resources = toJS(this.value.resources);
    const steps = toJS(this.value.taskSteps);
    const workspaces = toJS(this.value.workspace);

    const volumes = [
      {
        name: "build-path",
        emptyDir: {},
      },
    ];

    try {
      this.task.metadata.name = this.value.taskName;
      this.task.spec.params = parms;
      this.task.spec.resources = resources;
      this.task.spec.workspaces = workspaces;

      this.task.spec.steps = steps;
      await taskStore.update(this.task, {...this.task});
      Notifications.ok(<>Task {this.value.taskName} save succeeded</>);
      this.close();
    } catch (err) {
      this.value.taskName = "";
      Notifications.error(err);
    }
  };

  render() {
    const header = (
      <h5>
        <Trans>Config Task</Trans>
      </h5>
    );

    return (
      <ThemeProvider theme={theme}>
        <Dialog
          isOpen={ConfigTaskDialog.isOpen}
          className="ConfigTaskDialog"
          onOpen={this.onOpen}
          close={this.close}
        >
          <Wizard header={header} done={this.close}>
            <WizardStep contentClass="flex gaps column" next={this.handle}>

              <SubTitle title={<Trans>Task Name</Trans>}/>
              <Input
                iconLeft={<b>{this.prefix}</b>}
                required={true}
                validators={systemName}
                placeholder={_i18n._("Task Name")}
                value={this.value.taskName}
                onChange={(value) => (this.value.taskName = value)}
              />
              <br/>
              <TaskSpecWorkSpaces
                value={this.value.workspace}
                onChange={(vaule) => {
                  this.value.workspace = vaule;
                }}
              />
              <br/>
              <PipelineParamsDetails
                value={this.value.pipelineParams}
                onChange={(value) => {
                  this.value.pipelineParams = value;
                }}
              />
              <br/>
              <ResourcesDetail
                value={this.value.resources}
                onChange={(value) => {
                  this.value.resources = value;
                }}
              />
              <br/>
              <MultiTaskStepDetails
                value={this.value.taskSteps}
                onChange={(value) => {
                  this.value.taskSteps = value;
                }}
              />

            </WizardStep>
          </Wizard>
        </Dialog>
      </ThemeProvider>
    );
  }
}