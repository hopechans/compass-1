import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {resources} from "./common";
import {TaskResources} from "client/api/endpoints/tekton-task.api";
import {TaskResourceDetails} from "./task-resource-details";
import {Grid, Divider, Card} from "@material-ui/core";
import {SubTitle} from "../layout/sub-title";
import {Trans} from "@lingui/macro";
import {Row} from "../grid";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class ResourcesDetail extends React.Component<Props> {
  @observable value: TaskResources = this.props.value || resources;

  render() {
    return (
      <div>
        <TaskResourceDetails
          value={this.value.inputs}
          title={"Resource Inputs"}
          onChange={(value) => {
            this.value.inputs = value;
          }}
        />
        <TaskResourceDetails
          value={this.value.outputs}
          title={"Resource Outputs"}
          onChange={(value) => {
            this.value.outputs = value;
          }}
        />
        <Divider/>
      </div>
    );
  }
}
