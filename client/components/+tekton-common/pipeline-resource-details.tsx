import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Select, SelectOption} from "../select";
import {Icon} from "../icon";
import {Trans} from "@lingui/macro";
import {PipelineResources, pipelineResources} from "./common";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  disable?: boolean

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class PipelineResourceDetails extends React.Component<Props> {

  static defaultProps = {
    disable: false,
  }

  @observable value: PipelineResources[] = this.props.value || [];

  add = () => {
    this.value.push(pipelineResources);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  get typeOptions() {
    return [
      "image",
      "git"
    ];
  }

  formatOptionLabel = (option: SelectOption) => {
    const {value, label} = option;
    return (
      label || (
        <>
          <Icon small material="layers"/>
          {value}
        </>
      )
    );
  };

  rTab() {
    return (
      <>
        <br/>
        <Grid container spacing={5}>
          <Grid item xs={5}>
            <Trans>Name</Trans>
          </Grid>
          <Grid item xs={5}>
            <Trans>ResourceType</Trans>
          </Grid>
        </Grid>
        <br/>
      </>
    )
  }

  rForm(index: number, disable: boolean) {
    return (
      <>
        <Grid container spacing={5}>
          <Grid item xs={5}>
            <Input
              placeholder={"name"}
              disabled={disable}
              value={this.value[index].name}
              onChange={(value) => (this.value[index].name = value)}
            />
          </Grid>
          <Grid item xs={5}>
            <Select
              value={this.value[index].type}
              isDisabled={disable}
              options={this.typeOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={(value) => (this.value[index].type = value.value)}
            />
          </Grid>
          <Grid item xs>
            <Icon
              small
              material="clear"
              onClick={(e) => {
                e.stopPropagation();
                this.remove(index);
              }}
            />
          </Grid>
        </Grid>
        <br/>
      </>
    )
  }

  render() {

    const {disable} = this.props
    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>Pipeline Resources</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        {this.value.length > 0 ? this.rTab() : null}
        {this.value.map((item, index) => {
          return this.rForm(index, disable);
        })}
      </>
    );
  }
}
