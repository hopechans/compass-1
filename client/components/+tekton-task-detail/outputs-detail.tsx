import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { taskResources, ResourceDeclaration, inputs } from "./common";
import { Col, Row } from "antd";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { Input } from "../input";
import { Inputs } from "client/api/endpoints/tekton-task.api";
import { TaskResourceDetails } from "./task-resource-details";
import { PipelineParamsDetails } from "./pipeline-params-details";
import { Grid, Divider, Card } from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class OutPutsDetail extends React.Component<Props> {
  @observable value: Inputs = this.props.value || inputs;

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

  render() {
    return (
      <div>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <b>Outputs</b>
          </Grid>
          <Grid item xs={9}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={11}>
            <Card>
              <TaskResourceDetails
                value={this.value.resources}
                onChange={(value) => {
                  this.value.resources = value;
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
