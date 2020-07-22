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
  TaskSpecWorkSpaces,
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
import { configStore } from "../../config.store";
import { WorkspaceDeclaration as Workspace } from "../../api/endpoints/tekton-task.api";
import { IKubeObjectMetadata } from "../../../client/api/kube-object";
import { namespaceStore } from "../+namespaces/namespace.store";
interface Props<T = any> extends Partial<Props> {
  value?: T;

  onChange?(option: T, meta?: ActionMeta<any>): void;

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
export class CopyTaskDialog extends React.Component<Props> {
  @observable value: TaskResult = this.props.value || task;
  @observable static isOpen = false;
  @observable static graph: any;
  @observable static node: any;
  @observable static data: any;
  @observable ifSwitch: boolean = false;
  @observable name: string;
  @observable change: boolean;

  static open(graph: any, node: any) {
    CopyTaskDialog.isOpen = true;
    this.graph = graph;
    this.node = node;
  }

  loadData = async (name: string) => {
    try {
      const defaultNameSpace = configStore.getOpsNamespace();
      const task = taskStore.getByName(name, defaultNameSpace);
      if (task !== undefined) {
        this.value.resources = task.getResources();
        this.value.taskSteps = task.getSteps();
        this.value.workspace = task.getWorkspaces();
        this.value.volumes = task.getVolumes();
        this.value.pipelineParams = task.getParams();
        this.value.taskName = task.getName();
      }
    } catch (err) {
      return err;
    }
  };

  onOpen = () => {
    try {
      if (this.ifSwitch) {
      }

      const group = CopyTaskDialog.node.getContainer();
      let shape = group.get("children")[2];
      const name = shape.attrs.text;
      this.loadData(name);
    } catch (err) {
      Notifications.error(err);
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

  saveTask = () => {
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
      if (!this.ifSwitch) {
        this.value.taskName = this.value.taskName;
      }

      const task = taskStore.getByName(this.value.taskName);
      if (task === undefined) {
        taskStore.create(
          {
            name: this.value.taskName,
            namespace: configStore.getOpsNamespace(),
            labels: new Map<string, string>().set(
              "namespace",
              configStore.getDefaultNamespace()
            ),
          },
          {
            spec: {
              params: parms,
              resources: resources,
              steps: steps,
              volumes: volumes,
              workspaces: workspaces,
            },
          }
        );
      } else {
        if (!this.ifSwitch) {
          task.metadata.name = this.value.taskName;
          task.spec.params = parms;
          task.spec.resources = resources;
          task.spec.workspaces = workspaces;
          task.spec.steps = steps;
          taskStore.apply(task, { ...task });
        }
      }
      Notifications.ok(<>Task {this.value.taskName} save succeeded</>);
      this.close();
    } catch (err) {
      this.value.taskName = "";
      Notifications.error(err);
    }
  };

  handleChange = async (event: any) => {
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
      .getAllByNs(namespaceStore.getAllOpsNamespace())
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
          className="CopyAddDeployDialog"
          onOpen={this.onOpen}
          close={this.close}
        >
          <Wizard header={header} done={this.close}>
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
                  required={true}
                  validators={systemName}
                  placeholder={_i18n._("Task Name")}
                  value={this.value.taskName}
                  onChange={(value) => (this.value.taskName = value)}
                />
                <br />
                <TaskSpecWorkSpaces
                  value={this.value.workspace}
                  onChange={(vaule) => {
                    this.value.workspace = vaule;
                  }}
                />
                <br />
                <PipelineParamsDetails
                  value={this.value.pipelineParams}
                  onChange={(value) => {
                    this.value.pipelineParams = value;
                  }}
                />
                <br />
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
