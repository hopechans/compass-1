import { observer } from "mobx-react";
import React from "react";
import { observable, toJS } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Trans } from "@lingui/macro";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Pipeline } from "../../api/endpoints";
import { Notifications } from "../notifications";
import { PipelineDetails, PipelineResult, pipeline } from "./pipeline-details";
import { pipelineStore } from "./pipeline.store";
import { task } from "../+tekton-task/copy-task-dialog";
import { pipelineTaskResource } from "./pipeline-task";
import { taskStore } from "../+tekton-task/task.store";

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
    PipelineDialog.currentPipeline = null;
    PipelineDialog.currentPipeline = pipeline;
    PipelineDialog.isOpen = true;
  }

  get CurrentPipeline() {
    return PipelineDialog.currentPipeline;
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
    this.value.tasks = [];
    let currentPipeline = PipelineDialog.currentPipeline;

    currentPipeline.spec.tasks.map((item, index) => {
      let task = taskStore.getByName(item.name);
      if (task !== undefined) {
        this.value.tasks.push(currentPipeline.spec.tasks[index]);

        this.value.tasks[index].resources = null;
        this.value.tasks[index].resources = pipelineTaskResource;
        if (task.spec.resources.inputs !== undefined) {
          task.spec.resources.inputs.map((task: { name: any }) => {
            this.value.tasks[index].resources.inputs.push({
              name: task.name,
              resource: "",
            });
          });
        }

        if (task.spec.resources.outputs !== undefined) {
          task.spec.resources.outputs.map((task: { name: any }) => {
            this.value.tasks[index].resources.outputs.push({
              name: task.name,
              resource: "",
            });
          });
        }
      }
    });

    this.value.tasks.map((item: any, index: number) => {
      if (item.resources === undefined) {
        this.value.tasks[index].resources = pipelineTaskResource;
      }

      if (item.params === undefined) {
        this.value.tasks[index].params = [];
      }
      // if (item.retries === undefined) {
      //   this.value.tasks[index].retries = 0;
      // }
      // if (item.timeout === undefined || item.timeout == "") {
      //   this.value.tasks[index].timeout = "0";
      // }
    });

    this.value.pipelineName = currentPipeline.metadata.name;
    const resources = currentPipeline.spec.resources;
    if (currentPipeline.spec.params !== undefined) {
      this.value.params = currentPipeline.spec.params;
    }

    if (resources !== undefined) {
      this.value.resources = resources;
    }

    if (currentPipeline.spec.workspaces !== undefined) {
      this.value.workspaces = currentPipeline.spec.workspaces;
    }
  };

  submit = async () => {
    let pipeline = PipelineDialog.currentPipeline;

    pipeline.metadata.name = this.value.pipelineName;

    // pipeline.metadata.namespace = "ops";
    pipeline.spec.resources = this.value.resources;

    //a b[] //a.b.
    pipeline.spec.tasks = this.value.tasks;
    pipeline.spec.params = this.value.params;
    pipeline.spec.workspaces = this.value.workspaces;
    try {
      // //will update pipeline
      await pipelineStore.update(pipeline, { ...pipeline });
      Notifications.ok(<>pipeline {this.value.pipelineName} save successed</>);
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
              onChange={(value) => {
                this.value = value.value;
              }}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
