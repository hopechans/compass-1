import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {PipelineTaskInputResource} from "../../api/endpoints";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {Grid} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  title?: string;
  disable?: boolean;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

export const pipelineTaskInputResource: PipelineTaskInputResource = {
  name: "",
  resource: "",
};

@observer
export class PipelineTaskInputResourceDetail extends React.Component<Props> {

  static defaultProps = {
    title: "Pipeline Resources",
    disable: false
  };

  @observable value: PipelineTaskInputResource[] = this.props.value || [];

  add = () => {
    this.value.push(pipelineTaskInputResource);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  render() {
    const {title, disable} = this.props;
    return (
      <div className="params">
        <SubTitle className="fields-title" title={title}>
          {!disable ?
            <Icon
              small
              tooltip={_i18n._(t`resource`)}
              material="add_circle_outline"
              onClick={(e) => {
                this.add();
                e.stopPropagation();
              }}
            /> : null}
        </SubTitle>
        {this.value.length > 0 ?
          <>
            <Grid container spacing={5}>
              <Grid item xs>
                <Trans>Name</Trans>
              </Grid>
              <Grid item xs>
                <Trans>Resource</Trans>
              </Grid>
            </Grid>
            <br/>
          </> : null}
        {this.value.map((item, index) => {
          return (
            <div>
              <Grid container spacing={5}>
                <Grid item xs>
                  <Input
                    placeholder={_i18n._(t`Name`)}
                    disabled={true}
                    value={this.value[index].name}
                    onChange={(value) => {
                      this.value[index].name = value;

                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Input
                    placeholder={_i18n._(t`Value`)}
                    value={this.value[index].resource}
                    onChange={(value) => {
                      this.value[index].resource = value;
                      console.log(this.value[index].resource);
                    }}
                  />
                </Grid>
                {!disable ?? <Grid item xs>
                  <Icon
                    small
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation();
                    }}
                  />
                </Grid>}
              </Grid>
              <br/>
            </div>
          )
        })}
      </div>
    );
  }
}