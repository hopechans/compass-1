import { observer } from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  PipelineResourceDetails,
  TaskNameDetails,
  MultiTaskStepDetails, PipelineParams, PipelineResources, TaskStep, taskStep
} from "../+tekton-task-detail";
import { observable } from "mobx";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Trans } from "@lingui/macro";
import { ActionMeta } from "react-select/src/types";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  onChange?(option: T, meta?: ActionMeta): void;
  themeName?: "dark" | "light" | "outlined";
}

export interface TaskResult {
  taskName: string
  pipelineParams: PipelineParams[];
  pipelineResources: PipelineResources[],
  taskSteps: TaskStep[],
}


export const task: TaskResult = {
  taskName: "defaultName",
  pipelineParams: [],
  pipelineResources: [],
  taskSteps: [taskStep],
}

@observer
export class CopyTaskDialog extends React.Component<Props> {
  @observable value: TaskResult = this.props.value || task;
  @observable static isOpen = false;
  @observable taskName: string = "";
  @observable pipelineParams: PipelineParams[] = [];
  @observable pipelineResources: PipelineResources[] = [];
  @observable taskSteps: TaskStep[] = [taskStep];

  static open() {
    CopyTaskDialog.isOpen = true;
  }

  static close() {
    CopyTaskDialog.isOpen = false;
  }

  close = () => {
    CopyTaskDialog.close();
  }

  handle = async () => {
    console.log(this.taskName, this.pipelineParams);
  }

  render() {
    const header = <h5><Trans>Apply Task</Trans></h5>;

    return (
      <Dialog
        isOpen={CopyTaskDialog.isOpen}
        close={this.close}
      >
        <Wizard className="CopyAddDeployDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.handle}>
            <TaskNameDetails
              value={this.taskName}
              onChange={(value) => {
                this.taskName = value
              }} />
            <br />
            <PipelineParamsDetails value={this.pipelineParams} onChange={value => {
              this.pipelineParams = value
            }} />
            <br />
            <PipelineResourceDetails value={this.value.pipelineResources} onChange={value => {
              this.value.pipelineResources = value
            }} />
            <br />
            <MultiTaskStepDetails value={this.value.taskSteps} onChange={value => {
              this.value.taskSteps = value
            }} />
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}