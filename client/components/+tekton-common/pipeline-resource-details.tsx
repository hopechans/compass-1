import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Select, SelectOption} from "../select";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {PipelineResources, pipelineResources} from "./common";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {Input} from "../input";
import {Grid} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: boolean;
  disable?: boolean

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class PipelineResourceDetails extends React.Component<Props> {

  static defaultProps = {
    divider: false,
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
    return ["image", "git"];
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

  render() {

    const {disable} = this.props

    return (
      <div className="Resource">
        <SubTitle className="fields-title" title="Pipeline Resources">
          <Icon
            small
            tooltip={_i18n._(t`Resource`)}
            material="add_circle_outline"
            onClick={(e) => {
              this.add();
              e.stopPropagation();
            }}
          />
        </SubTitle>
        {this.value.length > 0 ? (
          <>
            <Grid container spacing={5}>
              <Grid item xs>
                <Trans>Name</Trans>
              </Grid>
              <Grid item xs>
                <Trans>ResourceType</Trans>
              </Grid>
            </Grid>
            <br/>
          </>
        ) : (
          null
        )}

        {this.value.map((item, index) => {
          return (
            <>
              <Grid container spacing={5}>
                <Grid item xs>
                  <Input
                    placeholder={"name"}
                    disabled={disable}
                    value={this.value[index].name}
                    onChange={(value) => (this.value[index].name = value)}
                  />
                </Grid>
                <Grid item xs>
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
                    material="remove_circle_outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.remove(index);
                    }}
                  />
                </Grid>
              </Grid>
              <br/>
            </>
          );
        })}
      </div>
    );
  }
}
