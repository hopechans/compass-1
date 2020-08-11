import "./add-webhook-dialog.scss";

import {observer} from "mobx-react";
import React from "react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {isUrl, systemName} from "../input/input.validators";
import {_i18n} from "../../i18n";
import {PipelineRunSelect} from "../+tekton-pipelinerun/pipelinerun-select";
import {ArgsDetails} from "../+deploy-container";
import {configStore} from "../../config.store";
import {Notifications} from "../notifications";
import {tektonWebHookStore} from "./webhook.store";

interface Props extends DialogProps {
}

@observer
export class AddWebhookDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name: string = "";
  @observable git: string = "";
  @observable branch: string = "";
  @observable pipelineRun: string = "";
  @observable args: string[] = [];

  static open() {
    AddWebhookDialog.isOpen = true;
  }

  static close() {
    AddWebhookDialog.isOpen = false;
  }

  close = () => {
    AddWebhookDialog.close();
  }

  reset() {
    this.name = "";
    this.git = "";
    this.branch = "";
    this.pipelineRun = "";
    this.args = [];
  }

  addWebHook = async () => {
    try {
      await tektonWebHookStore.create(
        {
          name: this.name,
          namespace: configStore.getOpsNamespace(),
        },
        {
          spec: {
            git: this.git,
            branch: this.branch,
            pipeline_run: this.pipelineRun,
            args: this.args,
          },
        });
      Notifications.ok(
        <>WebHook {name} succeeded</>
      );
      this.reset();
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const header = <h5><Trans>Add Webhook</Trans></h5>;

    return (
      <Dialog
        className="AddWebhookDialog"
        isOpen={AddWebhookDialog.isOpen}
        close={this.close}
        pinned
      >
        <Wizard className={"AddWebhookWizard"} header={header} done={this.close}>
          <WizardStep className={"AddWebhookWizardStep"} contentClass="flex gaps column" next={this.addWebHook}>
            <SubTitle title={<Trans>Name</Trans>}/>
            <Input
              validators={systemName}
              placeholder={_i18n._(t`Name`)}
              value={this.name}
              onChange={value => this.name = value}
            />
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