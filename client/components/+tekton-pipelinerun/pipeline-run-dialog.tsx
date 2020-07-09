import "./pipeline-run-dialog.scss";
import { observer } from "mobx-react";
import React from "react";
import { observable, toJS } from "mobx";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { ActionMeta } from "react-select/src/types";
import { Trans } from "@lingui/macro";
import { Dialog } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import {
  pipelineRunApi,
  PipelineResourceBinding,
  PipelineRef,
  PipelineDeclaredResource,
  WorkspaceBinding,
} from "../../api/endpoints";
import { Notifications } from "../notifications";
import { PipelineRunResourceDetails } from "./pipeline-run-resource-details";
import { systemName } from "../input/input.validators";
import { configStore } from "../../config.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { pipelineRunStore } from "./pipelinerun.store";
import { PipelineRunWorkspaces } from "../+tekton-common/pipelinerun-workspaces";
import { workspaceBinding } from "../+tekton-common";
interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

export interface PipelineRunResult {
  name: string;
  pipelineRef: PipelineRef;
  resources?: PipelineResourceBinding[];
  serviceAccountName?: string;
  workspces: WorkspaceBinding[];
}

export const ref: PipelineRef = {
  name: "",
};

export const pipelineRunResult: PipelineRunResult = {
  name: "",
  serviceAccountName: "default",
  pipelineRef: ref,
  resources: [],
  workspces: [],
};

@observer
export class PipelineRunDialog extends React.Component<Props> {
  @observable static isOpen = false;
  @observable static pipelineName: string = "";
  @observable value: PipelineRunResult = this.props.value || pipelineRunResult;

  static open(pipelineName: string) {
    PipelineRunDialog.pipelineName = pipelineName;
    PipelineRunDialog.isOpen = true;
  }

  static close() {
    PipelineRunDialog.isOpen = false;
  }

  close = () => {
    this.value.resources = [];
    PipelineRunDialog.close();
  };

  onOpen = () => {
    this.value.pipelineRef.name = PipelineRunDialog.pipelineName;
    const timeStamp = Math.round(new Date().getTime() / 1000);
    this.value.name =
      PipelineRunDialog.pipelineName +
      "-" +
      (configStore.getDefaultNamespace() == ""
        ? "admin"
        : configStore.getDefaultNamespace()) +
      "-" +
      timeStamp;
    //fill the  resources
    const currentPipeline = pipelineStore.getByName(
      this.value.pipelineRef.name
    );
    currentPipeline.spec.resources.map((item: any, index: number) => {
      let resources: PipelineResourceBinding = {
        name: item.name,
        resourceRef: { name: "" },
      };
      this.value.resources.push(resources);
    });
    //TODO:need callback workspace.but pipeline-run name problem.  and operater it.
    // this.value.workspces;
  };

  submit = async () => {
    try {
      // create a pipeline run
      let resources: PipelineDeclaredResource[] = this.value.resources;
      let workspaces = this.value.workspces;
      await pipelineRunStore.create(
        {
          name: this.value.name,
          namespace: "",
          labels: new Map<string, string>().set(
            "namespace",
            configStore.getDefaultNamespace() == ""
              ? "admin"
              : configStore.getDefaultNamespace()
          ),
        },
        {
          spec: {
            resources: resources,
            pipelineRef: this.value.pipelineRef,
            serviceAccountName: this.value.serviceAccountName,
            workspaces: workspaces,
          },
        }
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  render() {
    const header = (
      <h5>
        <Trans>Pipeline Run</Trans>
      </h5>
    );

    return (
      <Dialog
        isOpen={PipelineRunDialog.isOpen}
        close={this.close}
        onOpen={this.onOpen}
      >
        <Wizard className="PipelineRunDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.submit}>
            <SubTitle title={<Trans>Name</Trans>} />
            <Input
              placeholder={_i18n._("Pipeline Run Name")}
              disabled={true}
              validators={systemName}
              value={this.value.name}
              onChange={(value) => (this.value.name = value)}
            />
            <SubTitle title={<Trans>Pipeline Ref</Trans>} />
            <Input
              placeholder={_i18n._("pipeline ref")}
              disabled={true}
              value={this.value?.pipelineRef?.name}
              onChange={(value) => (this.value.pipelineRef.name = value)}
            />
            <SubTitle title={<Trans>Service Account Name</Trans>} />
            <Input
              disabled={true}
              placeholder={_i18n._("Service Account Name")}
              value={this.value?.serviceAccountName}
              onChange={(value) => (this.value.serviceAccountName = value)}
            />
            <br />
            <PipelineRunResourceDetails
              value={this.value?.resources}
              onChange={(value) => {
                this.value.resources = value;
              }}
            />
            <br />

            <PipelineRunWorkspaces
              value={this.value?.workspces}
              onChange={(value) => {
                this.value.workspces = value;
              }}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
