import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { resources } from "./common";
import { _i18n } from "../../i18n";
import { TaskResources } from "client/api/endpoints/tekton-task.api";
import { TaskResourceDetails } from "./task-resource-details";
import { Grid, Divider, Card } from "@material-ui/core";

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
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <b>Resources</b>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <b>Inputs</b>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={11}>
            <Card>
              <TaskResourceDetails
                value={this.value.inputs}
                onChange={(value) => {
                  this.value.inputs = value;
                }}
              />
            </Card>
            <Divider />
          </Grid>

          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <b>Outputs</b>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={11}>
            <Card>
              <TaskResourceDetails
                value={this.value.outputs}
                onChange={(value) => {
                  this.value.outputs = value;
                }}
              />
            </Card>
            <Divider />
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  }
}
