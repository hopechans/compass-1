import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Input} from "../input";
import {ActionMeta} from "react-select/src/types";
import {ArgsDetails, CommandDetails} from "../+deploy-container";
import {Divider} from "@material-ui/core";
import {EnvironmentDetails} from "../+deploy-container/env-details";
import {TaskStep, taskStep} from "./common";
import {SubTitle} from "../layout/sub-title";
import {WorkspacesDetails} from "./workspaces-details";
import {WorkDirDetails} from "./workdir-details";
import {ResultsDetails} from "./results-details";
import {ScriptDetails} from "./script-details";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class TaskStepDetails extends React.Component<Props> {

  static defaultProps = {
    value: taskStep
  }

  @observable value: TaskStep = this.props.value || taskStep

  render() {
    return (
      <>
        <SubTitle title={"StepName"}/>
        <Input
          placeholder={"StepName"}
          value={this.value.name}
          onChange={value => (this.value.name = value)}
        />
        <br/>
        <SubTitle title={"Image"}/>
        <Input
          placeholder={"Image"}
          value={this.value.image}
          onChange={value => (this.value.image = value)}
        />
        <br/>
        <WorkDirDetails
          value={this.value.workingDir}
          onChange={value => this.value.workingDir = value}/>
        <br/>
        <ArgsDetails
          value={this.value.args}
          onChange={value => this.value.args = value}
        />
        <Divider/>
        <br/>
        <CommandDetails
          value={this.value.commands}
          onChange={value => this.value.commands = value}
        />
        <Divider/>
        <br/>
        <EnvironmentDetails
          value={this.value.environment}
          onChange={value => this.value.environment = value}
        />
        <Divider/>
        <br/>
        <WorkspacesDetails
          value={this.value.workspaces}
          onChange={value => this.value.workspaces = value}/>
        <Divider/>
        <br/>
        <ResultsDetails
          value={this.value.results}
          onChange={value => this.value.results = value}/>
        <br/>
        <Divider/>
        <ScriptDetails />
      </>
    )
  }
}