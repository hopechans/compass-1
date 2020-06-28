import "./copy-task-dialog.scss";

import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Trans } from "@lingui/macro";
import { ActionMeta } from "react-select/src/types";
import { _i18n } from "../../i18n";
import { PipelineDetails, PipelineResult, pipeline } from "./pipeline-details";
interface Props<T = any> extends Partial<Props> {
  value?: T;

  onChange?(option: T, meta?: ActionMeta): void;

  themeName?: "dark" | "light" | "outlined";
}

@observer
export class PilelineDialog extends React.Component<Props> {
  @observable value: PipelineResult = this.props.value || pipeline;
  @observable static isOpen = false;

  static open() {
    PilelineDialog.isOpen = true;
  }

  onOpen = () => {};

  static close() {
    PilelineDialog.isOpen = false;
  }

  close = () => {
    PilelineDialog.close();
  };

  handle = () => {
    PilelineDialog.close();
  };

  toTask() {}

  render() {
    const header = (
      <h5>
        <Trans>Apply Pipeline</Trans>
      </h5>
    );

    return (
      <Dialog
        isOpen={PilelineDialog.isOpen}
        // onOpen={this.onOpen}
        close={this.close}
      >
        <Wizard className="Pipeline-Dialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.handle}>
            <PipelineDetails
              value={this.value}
              onChange={(value) => (this.value = value)}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
