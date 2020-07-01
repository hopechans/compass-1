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
} from "../../api/endpoints";
import { Notifications } from "../notifications";
import { PipelineRunResourceDetails } from "./pipeline-run-resource-details";
import { systemName } from "../input/input.validators";
import { configStore } from "../../../client/config.store";

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
}

export const ref: PipelineRef = {
  name: "",
};

export const pipelineRunResult: PipelineRunResult = {
  name: "",
  serviceAccountName: "default",
  pipelineRef: ref,
  resources: [],
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
    PipelineRunDialog.close();
  };

  onOpen = () => {
    this.value.pipelineRef.name = PipelineRunDialog.pipelineName;
    const timeStamp = Math.round(new Date().getTime()/1000)
    this.value.name = PipelineRunDialog.pipelineName + '-' + (configStore.getDefaultNamespace() == "" ? 'admin' : configStore.getDefaultNamespace()) + '-' + timeStamp;
  };

  submit = async () => {
    try {
      // create a pipeline run
      let newPipelineRun = await pipelineRunApi.create(
        { name: this.value.name, namespace: "" },
        {
          spec: {
            resources: this.value.resources,
            pipelineRef: this.value.pipelineRef,
            serviceAccountName: this.value.serviceAccountName,
          },
        }
      );
      // label the resource labels
      newPipelineRun.metadata.labels = {
        namespace: configStore.getDefaultNamespace(),
      };
      await pipelineRunApi.update(
        {
          name: newPipelineRun.metadata.name,
          namespace: newPipelineRun.metadata.namespace,
        },
        { ...newPipelineRun }
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
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
