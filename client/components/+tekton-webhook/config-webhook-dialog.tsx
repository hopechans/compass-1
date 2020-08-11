import "./config-webhook-dialog.scss";

import {observer} from "mobx-react";
import React from "react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {isUrl} from "../input/input.validators";
import {_i18n} from "../../i18n";
import {PipelineRunSelect} from "../+tekton-pipelinerun/pipelinerun-select";
import {ArgsDetails} from "../+deploy-container";
import {Notifications} from "../notifications";
import {tektonWebHookStore} from "./webhook.store";
import {TektonWebHook} from "../../api/endpoints/tekton-webhook.api";

interface Props extends DialogProps {
}

@observer
export class ConfigWebhookDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static Data: TektonWebHook = null;
  @observable git: string = "";
  @observable branch: string = "";
  @observable pipelineRun: string = "";
  @observable args: string[] = [];

  static open(webhook: TektonWebHook) {
    ConfigWebhookDialog.isOpen = true;
    ConfigWebhookDialog.Data = webhook;
  }

  get webhook() {
    return ConfigWebhookDialog.Data;
  }

  onOpen = async () => {
    this.git = this.webhook.spec?.git || "";
    this.branch = this.webhook.spec?.branch || "";
    console.log(this.webhook.spec.pipeline_run);
    this.pipelineRun = this.webhook.spec?.pipeline_run || "";
    this.args = this.webhook.spec?.args || [];
  }

  static close() {
    ConfigWebhookDialog.isOpen = false;
  }

  reset() {
    this.git = "";
    this.branch = "";
    this.pipelineRun = "";
    this.args = [];
  }

  close = () => {
    this.reset();
    ConfigWebhookDialog.close();
  }

  updateWebHook = async () => {
    try {

      this.webhook.spec.git = this.git;
      this.webhook.spec.branch = this.branch;
      this.webhook.spec.pipeline_run = this.pipelineRun;
      this.webhook.spec.args = this.args;

      await tektonWebHookStore.update(this.webhook, {...this.webhook});
      Notifications.ok(
        <>WebHook {name} succeeded</>
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const header = <h5><Trans>Config Webhook</Trans></h5>;

    return (
      <Dialog
        className="ConfigWebhookDialog"
        isOpen={ConfigWebhookDialog.isOpen}
        onOpen={this.onOpen}
        close={this.close}
        pinned
      >
        <Wizard className={"ConfigWebhookWizard"} header={header} done={this.close}>
          <WizardStep className={"ConfigWebhookWizardStep"} contentClass="flex gaps column" next={this.updateWebHook}>
            <SubTitle title={<Trans>Git Address</Trans>}/>
            <Input
              validators={isUrl}
              placeholder={_i18n._(t`Git`)}
              value={this.git}
              onChange={value => this.git = value}
            />
            <SubTitle title={<Trans>Branch</Trans>}/>
            <Input
              placeholder={_i18n._(t`Branch`)}
              value={this.branch}
              onChange={value => this.branch = value}
            />
            <SubTitle title={<Trans>PipelineRun</Trans>}/>
            <PipelineRunSelect value={this.pipelineRun} onChange={value => this.pipelineRun = value.value}/>
            <ArgsDetails value={this.args} onChange={value => this.args = value}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}