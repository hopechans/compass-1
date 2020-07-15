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
  WorkspaceBinding, Pipeline, TenantRole, PipelineRun, TektonGraph,
} from "../../api/endpoints";
import { Notifications } from "../notifications";
import { PipelineRunResourceDetails } from "./pipeline-run-resource-details";
import { systemName } from "../input/input.validators";
import { configStore } from "../../config.store";
import { pipelineStore } from "../+tekton-pipeline/pipeline.store";
import { pipelineRunStore } from "./pipelinerun.store";
import { PipelineRunWorkspaces } from "../+tekton-common/pipelinerun-workspaces";
import { workspaceBinding } from "../+tekton-common";
import { tektonGraphStore } from "../+tekton-graph/tekton-graph.store";
import { IKubeObjectMetadata } from "../../api/kube-object";

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
  @observable static pipelineData: Pipeline = null;
  @observable graph: any = null;
  @observable value: PipelineRunResult = this.props.value || pipelineRunResult;

  static open(pipeline: Pipeline) {
    PipelineRunDialog.isOpen = true;
    PipelineRunDialog.pipelineData = pipeline;
  }

  static close() {
    PipelineRunDialog.isOpen = false;
  }

  close = () => {
    this.value.resources = [];
    this.reset();
    PipelineRunDialog.close();
  };

  get pipeline() {
    return PipelineRunDialog.pipelineData
  }

  onOpen = () => {
    const pipelineName = this.pipeline.getName();
    const timeStamp = Math.round(new Date().getTime() / 1000);

    this.value.pipelineRef.name = pipelineName;
    this.value.name =
      pipelineName +
      "-" +
      (configStore.getDefaultNamespace() == ""
        ? "admin"
        : configStore.getDefaultNamespace()) +
      "-" +
      timeStamp;
    //fill the  resources
    this.pipeline.spec.resources.map((item: any, index: number) => {
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

      const runNodeData = pipelineStore.getNodeData(this.pipeline);
      const runTektonGraphName = "run-" + this.pipeline.getName() + "-" + new Date().getTime().toString();

      let resources: PipelineDeclaredResource[] = this.value.resources;
      let workspaces = this.value.workspces;
      let copyLables = new Map<string, string>();
      this.pipeline.getLabels().map(label => {
        let labelSlice = label.split("=")
        if (labelSlice.length > 0 && labelSlice[0] == "namespace") {
          copyLables.set("namespace", labelSlice[1])
        }
      });

      const graph = await tektonGraphStore.create({
        name: runTektonGraphName,
        namespace: "ops",
        labels: copyLables,
      }, {
        spec: {
          data: JSON.stringify(runNodeData),
        },
      })

      const pipelineRun: Partial<PipelineRun> = {
        metadata: {
          name: this.value.name,
          annotations: Object.fromEntries(new Map<string, string>().set("fuxi.nip.io/run-tektongraphs", graph.getName())),
          labels: Object.fromEntries(
            new Map<string, string>().set("namespace", configStore.getDefaultNamespace() == ""
              ? "admin"
              : configStore.getDefaultNamespace())),
        } as IKubeObjectMetadata,
        spec: {
          resources: resources,
          pipelineRef: this.value.pipelineRef,
          serviceAccountName: this.value.serviceAccountName,
          workspaces: workspaces,
        },
      }

      await pipelineRunStore.create(
        { name: this.value.name, namespace: "" }, { ...pipelineRun });
      Notifications.ok(<>PipelineRun {this.value.name} Run Success</>);
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  reset = () => {
    this.graph = null;
  }

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
              placeholder={_i18n._("Pipeline Ref")}
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
