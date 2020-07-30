import {observer} from "mobx-react";
import React from "react";
import {observable, toJS} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {PipelineParams, pipelineParams} from "./common";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {Select} from "../select";
import {Grid} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  titleDisplay?: boolean
  disable?: boolean;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class PipelineParamsDetails extends React.Component<Props> {

  static defaultProps = {
    titleDisplay: true,
    disable: false,
  }

  @observable value: PipelineParams[] = this.props.value || [];

  get Options() {
    return ["string", "array"];
  }

  add = () => {
    this.value.push(pipelineParams);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  render() {

    const {titleDisplay, disable} = this.props;

    return (
      <div className="params">
        <SubTitle className="fields-title" title={titleDisplay ? <Trans>Pipeline Params</Trans> : ""}>
          {
            !disable ?
              <Icon
                small
                tooltip={_i18n._(t`Add Pipeline Params`)}
                material="add_circle_outline"
                onClick={(e) => {
                  this.add();
                  e.stopPropagation();
                }}
              /> : null
          }
        </SubTitle>
        {this.value.length > 0 ? (
          <div>
            <Grid container spacing={5}>
              <Grid item xs>
                <Trans>Name</Trans>
              </Grid>
              <Grid item xs>
                <Trans>Type</Trans>
              </Grid>
              <Grid item xs>
                <Trans>Default</Trans>
              </Grid>
            </Grid>
            <br/>
          </div>
        ) : (
          null
        )}
        {this.value.map((item, index) => {
          return (
            <div>
              <Grid container spacing={5}>
                <Grid item xs>
                  <Input
                    disabled={disable}
                    value={this.value[index].name}
                    onChange={(value) => (this.value[index].name = value)}
                  />
                </Grid>
                <Grid item xs>
                  <Select
                    isDisabled={disable}
                    value={this.value[index].type}
                    options={this.Options}
                    onChange={(value) => {
                      let result = toJS(value);
                      this.value[index].type = result.value;
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Input
                    disabled={disable}
                    value={this.value[index].default}
                    onChange={(value) => (this.value[index].default = value)}
                  />
                </Grid>
                {!disable ?
                  <Grid item xs>
                    <Icon
                      small
                      material="remove_circle_outline"
                      onClick={(e) => {
                        this.remove(index);
                        e.stopPropagation();
                      }}
                    />
                  </Grid> : null}
              </Grid>
              <br/>
            </div>
          );
        })}
      </div>
    );
  }
}
