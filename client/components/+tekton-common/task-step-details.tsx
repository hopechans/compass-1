import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { Input } from "../input";
import { ActionMeta } from "react-select/src/types";
import {
  ArgsDetails,
  CommandDetails,
  EvnVarDetails,
} from "../+deploy-container";
import { Divider } from "@material-ui/core";
import { TaskStep, taskStep } from "./common";
import { SubTitle } from "../layout/sub-title";
import { WorkspacesDetails } from "./workspaces-details";
import { ResultsDetails } from "./results-details";
import { _i18n } from "../../i18n";
import { Trans } from "@lingui/macro";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class TaskStepDetails extends React.Component<Props> {
  static defaultProps = {
    value: taskStep,
  };

  @observable value: TaskStep = this.props.value || taskStep;

  render() {
    return (
      <>
        <SubTitle title={"StepName"} />
        <Input
          placeholder={"StepName"}
          value={this.value.name}
          onChange={(value) => (this.value.name = value)}
        />
        <br />
        <SubTitle title={"Image"} />
        <Input
          placeholder={"Image"}
          value={this.value.image}
          onChange={(value) => (this.value.image = value)}
        />
        <br />
        <SubTitle title={"Working Dir"} />
        <Input
          placeholder={_i18n._("Working Dir")}
          value={this.value.workingDir}
          onChange={(value) => (this.value.workingDir = value)}
        />
        <br />

        <CommandDetails
          value={this.value.command}
          onChange={(value) => (this.value.command = value)}
        />
        <Divider />

        <br />
        <ArgsDetails
          value={this.value.args}
          onChange={(value) => (this.value.args = value)}
        />
        <Divider />
        <br />
        <EvnVarDetails
          value={this.value.env}
          onChange={(value) => (this.value.env = value)}
        />
        <Divider />
        <br />
        <WorkspacesDetails
          value={this.value.workspaces}
          onChange={(value) => (this.value.workspaces = value)}
        />
        {/* <Divider />
        <br />
        <ResultsDetails
          value={this.value.results}
          onChange={(value) => (this.value.results = value)}
        /> */}
        <br />
        <Divider />
        <SubTitle title={<Trans>Script</Trans>} />
        <Input
          multiLine={true}
          maxRows={10}
          placeholder={_i18n._("Script")}
          value={this.value.script}
          onChange={(value) => (this.value.script = value)}
        />
      </>
    );
  }
}
