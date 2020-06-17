import {observer} from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  PipelineResourceDetails,
  TaskNameDetails,
  MultiTaskStepDetails, PipelineParams, PipelineResources, TaskStep
} from "../+tekton-task-detail";
import {observable} from "mobx";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {Trans} from "@lingui/macro";

interface Props<T = any> extends Partial<Props> {
  themeName?: "dark" | "light" | "outlined";
}

@observer
export class CopyTaskDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable taskName: string = "default";
  @observable pipelineParams: PipelineParams[] = [];
  @observable pipelineResources: PipelineResources[] = [];
  @observable taskSteps: TaskStep[] = [];

  static open() {
    CopyTaskDialog.isOpen = true;
  }

  static close() {
    CopyTaskDialog.isOpen = false;
  }

  close = () => {
    CopyTaskDialog.close();
  }

  render() {
    const header = <h5><Trans>Apply Pipeline</Trans></h5>;

    return (
      <Dialog
        isOpen={CopyTaskDialog.isOpen}
        close={this.close}
      >
        <Wizard className="CopyAddDeployDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column">
            <TaskNameDetails value={this.taskName} onChange={value => {
              this.taskName = value
            }}/>
            <br/>
            <PipelineParamsDetails value={this.pipelineParams} onChange={value => {
              this.pipelineParams = value
            }}/>
            <br/>
            <PipelineResourceDetails value={this.pipelineResources} onChange={value => {
              this.pipelineResources = value
            }}/>
            <br/>
            <MultiTaskStepDetails value={this.taskSteps} onChange={value => {
              this.taskSteps = value
            }}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }

}