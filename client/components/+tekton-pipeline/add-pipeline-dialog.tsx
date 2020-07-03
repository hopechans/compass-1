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
import { pipelineApi } from "../../api/endpoints";
import { Notifications } from "../notifications";
import { configStore } from "../../config.store";
import { pipelineStore } from "./pipeline.store";

interface Props<T = any> extends Partial<Props> {
}

@observer
export class AddPipelineDialog extends React.Component<Props> {
  @observable prefix: string = configStore.getDefaultNamespace() || "admin";
  @observable static isOpen = false;
  @observable value: string = "";

  static open() {
    AddPipelineDialog.isOpen = true;
  }

  static close() {
    AddPipelineDialog.isOpen = false;
  }

  close = () => {
    AddPipelineDialog.close();
  };

  submit = async () => {
    try {
      await pipelineStore.create(
        {
          name: this.prefix + '-' + this.value, namespace: "",
          labels: new Map<string, string>().set("namespace", configStore.getDefaultNamespace() == "" ? "admin" : configStore.getDefaultNamespace())
        },
        {
          spec: {
            resources: [{ name: "", type: "" }],
            tasks: [],
            params: [],
          },
        }
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  render() {
    const header = (<h5><Trans>Create Pipeline</Trans></h5>);

    return (
      <Dialog
        isOpen={AddPipelineDialog.isOpen}
        close={this.close}
      >
        <Wizard className="AddPipelineDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.submit}>
            <SubTitle title={"Pipeline Name"} />
            <Input
              iconLeft={<b>{this.prefix}</b>}
              required={true}
              placeholder={_i18n._("Pipeline Name")}
              value={this.value}
              onChange={(value) => (this.value = value)}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
