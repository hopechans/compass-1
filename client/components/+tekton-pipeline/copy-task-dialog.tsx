import "./copy-task-dialog.scss";

import { observer } from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  TaskResourceDetails,
  MultiTaskStepDetails,
  PipelineParams,
  ResourceDeclaration,
  TaskStep,
  taskStep,
  InputsDetail,
  OutPutsDetail,
  inputs,
  outputs,
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
import { Inputs, Outputs } from "../../api/endpoints/tekton-task.api";
interface Props<T = any> extends Partial<Props> {
  value?: T;

  onChange?(option: T, meta?: ActionMeta): void;

  themeName?: "dark" | "light" | "outlined";
}

class Volume {
  name: string;
  emptyDir: any;
}

export interface TaskResult {
  taskName: string;
  pipelineParams: PipelineParams[];
  inputs: Inputs;
  outPuts: Outputs;
  taskSteps: TaskStep[];
  volumes?: Volume[];
}

export const task: TaskResult = {
  taskName: "task-name",
  pipelineParams: [],
  inputs: inputs,
  outPuts: outputs,
  taskSteps: [taskStep],
  volumes: [],
};

@observer
export class CopyTaskDialog extends React.Component<Props> {
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
      task.spec.inputs?.resources?.map((item: any, index: number) => {
        // this.value.taskResources[index].name = item.name;
        // this.value.taskResources[index].type = item.type;
      });
      task.spec?.params?.map((item: any, index: number) => {
        this.value.pipelineParams[index].default = item.default;
        this.value.pipelineParams[index].description = item.description;
        this.value.pipelineParams[index].name = item.name;
        this.value.pipelineParams[index].type = item.type;
      });
      this.value.taskSteps = task.spec.steps;
      this.value.volumes = task.spec.volumes;
      this.value.taskName = task.metadata.name;
    }
  };

  static close() {
    CopyTaskDialog.isOpen = false;
  }

  close = () => {
    CopyTaskDialog.close();
  };

  handle = () => {
    CopyTaskDialog.graph.setTaskName(this.value.taskName, CopyTaskDialog.node);
    this.saveTask();
    CopyTaskDialog.close();
  };

  toTask() {}

  saveTask = async () => {
    const parms = toJS(this.value.pipelineParams);
    const inputs = toJS(this.value.inputs);
    const outputs = toJS(this.value.outPuts);
    const steps = toJS(this.value.taskSteps);

    const volumes = [
      {
        name: "build-path",
        emptyDir: {},
      },
    ];

    try {
      await taskStore.create(
        { name: this.value.taskName, namespace: "" },
        {
          spec: {
            params: parms,
            inputs: inputs,
            outputs: outputs,
            steps: steps,
            volumes: volumes,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    // const resources = toJS(this.value.taskResources);
    // let gitResources: any = resources.map((item) => {
    //   if (item.type === "git") {
    //     return item;
    //   }
    // });
    // let imageResources: any = resources.map((item) => {
    //   if (item.type === "image") {
    //     return item;
    //   }
    // });
    // const params = this.value.pipelineParams;
    // // console.log(gitResources[0]);
    // try {
    //   if (imageResources[0] === undefined && gitResources[0] !== undefined) {
    //     await taskStore.create(
    //       { name: this.value.taskName, namespace: "" },
    //       {
    //         spec: {
    //           params: params,
    //           inputs: {
    //             resources: gitResources,
    //           },
    //           steps: toJS(this.value.taskSteps),
    //           volumes: [
    //             {
    //               name: "build-path",
    //               emptyDir: {},
    //             },
    //           ],
    //         },
    //       }
    //     );
    //   }
    //   if (gitResources[0] === undefined && imageResources[0] !== undefined) {
    //     await taskStore.create(
    //       { name: this.value.taskName, namespace: "" },
    //       {
    //         spec: {
    //           params: params,
    //           outputs: {
    //             resources: imageResources,
    //           },
    //           steps: toJS(this.value.taskSteps),
    //           volumes: [
    //             {
    //               name: "build-path",
    //               emptyDir: {},
    //             },
    //           ],
    //         },
    //       }
    //     );
    //   }
    //   if (gitResources[0] !== undefined && imageResources[0] !== undefined) {
    //     await taskStore.create(
    //       { name: this.value.taskName, namespace: "" },
    //       {
    //         spec: {
    //           params: params,
    //           inputs: {
    //             resources: gitResources,
    //           },
    //           outputs: {
    //             resources: imageResources,
    //           },
    //           steps: toJS(this.value.taskSteps),
    //           volumes: [
    //             {
    //               name: "build-path",
    //               emptyDir: {},
    //             },
    //           ],
    //         },
    //       }
    //     );
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
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
                label={this.ifSwitch ? "select" : "input"}
              />
            </FormGroup>
            <div hidden={this.ifSwitch}>
              <SubTitle title={"Task Name"} />
              <Input
                required={true}
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
              <InputsDetail
                value={this.value.inputs}
                onChange={(value) => {
                  this.value.inputs = value;
                }}
              />
              <br />
              <OutPutsDetail
                value={this.value.outPuts}
                onChange={(value) => {
                  this.value.outPuts = value;
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
    );
  }
}
