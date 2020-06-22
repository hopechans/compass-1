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
import { configStore } from "../../../client/config.store";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class AddPipelineDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable value: string = this.props.value || ""

  static open() {
    AddPipelineDialog.isOpen = true;
  }

  static close() {
    AddPipelineDialog.isOpen = false;
  }

  close = () => {
    AddPipelineDialog.close();
  }

  reset = () => {
    this.value = "";
  }

  submit = async () => {
    try {
      let newPipeline = await pipelineApi.create({ name: this.value, namespace: "" }, {
        spec: {
          resources: [{ name: "", type: "" }],
          tasks: [],
          params: [],
        }
      });
      // label the resource labels if the admin the namespace label default
      newPipeline.metadata.labels = { namespace: configStore.getDefaultNamespace() || "default" }
      await newPipeline.update(newPipeline);
      this.reset();
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const header = <h5><Trans>Create Pipeline</Trans></h5>;

    return (
      <Dialog
        isOpen={AddPipelineDialog.isOpen}
        close={this.close}
      >
        <Wizard className="AddPipelineDialog" header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.submit}>
            <SubTitle title={"Pipeline Name"} />
            <Input
              required={true}
              placeholder={_i18n._("Pipeline Name")}
              value={this.value}
              onChange={value => this.value = value}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}