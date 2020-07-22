import { observer } from "mobx-react";
import React from "react";
import { observable, toJS, ObservableSet } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { PipelineResourceBinding, PipelineRef } from "../../api/endpoints";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { Input } from "../input";
import { pipelineResourceStore } from "../+tekton-pipelineresource/pipelineresource.store";
import { Grid } from "@material-ui/core";
import { configStore } from "../../../client/config.store";
import { namespaceStore } from "../+namespaces/namespace.store";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  namespace?: string;
  onChange?(option: T, meta?: ActionMeta): void;
}

export const pipelineRef: PipelineRef = {
  name: "",
};

export const pipelineRunResource: PipelineResourceBinding = {
  name: "",
  resourceRef: pipelineRef,
};

@observer
export class PipelineRunResourceDetails extends React.Component<Props> {
  @observable value: PipelineResourceBinding[] = this.props.value || [];
  @observable namespace: string = this.props.namespace;

  add = () => {
    this.value.push(pipelineRunResource);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  get pipelineResouceOptions() {
    return [
      ...pipelineResourceStore
        .getAllByNs(this.namespace)
        .map((item) => ({ value: item.getName() }))
        .slice()
    ];
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

  render() {
    return (
      <div className="Resource">
        <SubTitle
          className="fields-title"
          title={<Trans>Pipeline Run Resources</Trans>}
        >
          <Icon
            small
            tooltip={_i18n._(t`Add Resource`)}
            material="add_circle_outline"
            onClick={(e) => {
              this.add();
              e.stopPropagation();
            }}
          />
        </SubTitle>

        {this.value.map((item, index) => {
          return (
            <Grid container spacing={1}>
              <Grid xs={12}>
                <br />
              </Grid>
              <Grid xs={2}>
                <SubTitle title={"Name"} />
              </Grid>
              <Grid xs={8}>
                <Input
                  placeholder={_i18n._("Name")}
                  value={this.value[index]?.name}
                  onChange={(value) => (this.value[index].name = value)}
                />
                <br />
              </Grid>
              <Grid xs={2} />
              <Grid xs={2}>
                <SubTitle title={"Resource Reference"} />
              </Grid>
              <Grid xs={8}>
                <Select
                  value={this.value[index]?.resourceRef?.name}
                  options={this.pipelineResouceOptions}
                  formatOptionLabel={this.formatOptionLabel}
                  onChange={(value: string) => {
                    const name: any = toJS(value);
                    this.value[index].resourceRef.name = name.value;
                  }}
                />
                <br />
              </Grid>
              <Grid xs={1} />
              <Grid xs={1}>
                <Icon
                  small
                  tooltip={<Trans>Remove</Trans>}
                  className="remove-icon"
                  material="remove_circle_outline"
                  onClick={(e) => {
                    this.remove(index);
                    e.stopPropagation();
                  }}
                />
              </Grid>
            </Grid>
          );
        })}
      </div>
    );
  }
}
