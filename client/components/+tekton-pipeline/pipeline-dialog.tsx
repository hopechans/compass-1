import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { ActionMeta } from "react-select/src/types";
import { Trans } from "@lingui/macro";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { pipelineApi, Pipeline } from "../../api/endpoints";
import { Notifications } from "../notifications";
import { configStore } from "../../../client/config.store";
import { PipelineDetails, PipelineResult, pipeline } from "./pipeline-details";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class PilelineDialog extends React.Component<Props> {
  @observable static isOpen = false;
  @observable static currentPipeline: Pipeline;
  @observable value: PipelineResult = this.props.value || pipeline;

  static open(pipeline: Pipeline) {
    PilelineDialog.currentPipeline = pipeline;
    PilelineDialog.isOpen = true;
  }

  static close() {
    PilelineDialog.isOpen = false;
  }

  close = () => {
    PilelineDialog.close();
  };

  reset = () => {
    this.value.pipelineName = "";
  };

  onOpen = () => {
    let pipeline = PilelineDialog.currentPipeline;
    this.value.tasks = pipeline.spec.tasks;
    this.value.pipelineName = pipeline.metadata.name;
    this.value.params = pipeline.spec.params;
    this.value.resources = pipeline.spec.resources;
    this.value.workspaces = pipeline.spec.workspaces;
  };

  submit = async () => {
    try {
      //will update pipeline
      let newPipeline = await pipelineApi.create(
        { name: this.value.pipelineName, namespace: "ops" },
        {
          spec: {
            resources: [{ name: "", type: "" }],
            tasks: [],
            params: [],
          },
        }
      );
      //label the resource labels if the admin the namespace label default
      newPipeline.metadata.labels = {
        namespace: configStore.getDefaultNamespace() || "default",
      };
      newPipeline.metadata.name = this.value.pipelineName;
      newPipeline.spec.params = this.value.params;
      newPipeline.spec.resources = this.value.resources;
      newPipeline.spec.tasks = this.value.tasks;
      newPipeline.spec.workspaces = this.value.workspaces;
      newPipeline.metadata.namespace = "ops";
      await newPipeline.update(newPipeline);
      this.reset();
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
        isOpen={PilelineDialog.isOpen}
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
