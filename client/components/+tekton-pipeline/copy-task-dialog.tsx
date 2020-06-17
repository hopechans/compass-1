import {observer} from "mobx-react";
import React from "react";
import {
  PipelineParamsDetails,
  PipelineResourceDetails,
  TaskNameDetails,
  MultiTaskStepDetails
} from "../+tekton-task-detail";
import {observable} from "mobx";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {Trans} from "@lingui/macro";
import {Divider} from "antd";

interface Props<T = any> extends Partial<Props> {
  themeName?: "dark" | "light" | "outlined";
}

@observer
export class CopyTaskDialog extends React.Component<Props> {

  @observable static isOpen = false;

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
          <WizardStep contentClass="flex gaps column" next={() => {}}>
            <TaskNameDetails/>
            <br/>
            <PipelineParamsDetails/>
            <br/>
            <PipelineResourceDetails/>
            <br/>
            <MultiTaskStepDetails/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }

}