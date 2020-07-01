import "./pipeline-dialog.scss"

import {observer} from "mobx-react";
import React from "react";
import {observable, toJS} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Trans} from "@lingui/macro";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {pipelineApi, Pipeline} from "../../api/endpoints";
import {Notifications} from "../notifications";
import {PipelineDetails, PipelineResult, pipeline} from "./pipeline-details";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class PipelineDialog extends React.Component<Props> {
  @observable static isOpen = false;
  @observable static currentPipeline: Pipeline;
  @observable value: PipelineResult = this.props.value || pipeline;

  static open(pipeline: Pipeline) {
    PipelineDialog.currentPipeline = pipeline;
    PipelineDialog.isOpen = true;
  }

  static close() {
    PipelineDialog.isOpen = false;
  }

  close = () => {
    PipelineDialog.close();
  };

  reset = () => {
    this.value.pipelineName = "";
  };

  onOpen = () => {
    let pipeline = PipelineDialog.currentPipeline;
    this.value.tasks = pipeline.spec.tasks;
    this.value.pipelineName = pipeline.metadata.name;
    if (pipeline.spec.params !== undefined) {
      this.value.params = pipeline.spec.params;
    }
    if (pipeline.spec.resources !== undefined) {
      this.value.resources = pipeline.spec.resources;
    }
    if (pipeline.spec.workspaces !== undefined) {
      this.value.workspaces = pipeline.spec.workspaces;
    }
  };

  submit = async () => {
    try {
      // //will update pipeline
      await pipelineApi.update(
        {name: this.value.pipelineName, namespace: "ops"},
        {
          spec: {
            resources: this.value.resources,
            tasks: this.value.tasks,
            params: this.value.params,
            workspaces: this.value.workspaces,
          },
        }
      );
      Notifications.ok(
        <>
          pipeline {this.value.pipelineName} save successed
        </>);
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  render() {
    const header = (
      <h5>
        <Trans>Save Pipeline</Trans>
      </h5>
    );

    return (
      <Dialog
        isOpen={PipelineDialog.isOpen}
        close={this.close}
        onOpen={this.onOpen}
      >
        <Wizard className="PipelineDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.submit}>
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
