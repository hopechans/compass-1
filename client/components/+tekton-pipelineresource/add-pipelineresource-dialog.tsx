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
import { pipelineResourceApi } from "../../api/endpoints";
import { Notifications } from "../notifications";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { Params } from "../+tekton-task-detail";
import { ParamsDetails } from "../+tekton-task-detail";
import { configStore } from "../../config.store";


interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class AddPipelineResourceDialog extends React.Component<Props> {
  @observable static isOpen = false;
  @observable prefix: string = configStore.getDefaultNamespace() || "admin";
  @observable name: string = "";
  @observable type: string = "git";
  @observable params: Params[] = [];

  static open() {
    AddPipelineResourceDialog.isOpen = true;
  }

  static close() {
    AddPipelineResourceDialog.isOpen = false;
  }

  close = () => {
    AddPipelineResourceDialog.close();
  };

  reset = () => {
    this.name = "";
    this.type = "git";
  };

  get selectOptions() {
    return ["git", "image"];
  }

  formatOptionLabel = (option: SelectOption) => {
    const { value, label } = option;
    return (
      label || (
        <>
          <Icon small material="layers" />
          {value}
        </>
      )
    );
  };

  submit = async () => {
    try {
      await pipelineResourceApi.create(
        {
          name: this.prefix + '-' + this.name, namespace: "",
          labels: new Map<string, string>().set("namespace", configStore.getDefaultNamespace() == "" ? "admin" : configStore.getDefaultNamespace())
        },
        {
          spec: {
            type: this.type,
            params: this.params,
          },
        }
      );
      this.reset();
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  render() {
    const header = (
      <h5>
        <Trans>Create Pipeline Resource</Trans>
      </h5>
    );

    return (
      <Dialog isOpen={AddPipelineResourceDialog.isOpen} close={this.close}>
        <Wizard
          className="AddPipelineResourceDialog"
          header={header}
          done={this.close}
        >
          <WizardStep contentClass="flex gaps column" next={this.submit}>
            <SubTitle title={"Pipeline Resource Name"} />
            <Input
              iconLeft={<b>{this.prefix}</b>}
              required={true}
              placeholder={_i18n._("Pipeline Resource Name")}
              value={this.name}
              onChange={(value) => (this.name = value)}
            />
            <SubTitle title={"Type"} />
            <Select
              className="Type"
              formatOptionLabel={this.formatOptionLabel}
              options={this.selectOptions}
              value={this.type}
              onChange={(value) => (this.type = value.value)}
            />
            <ParamsDetails
              value={this.params}
              onChange={(value) => (this.params = value)}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
