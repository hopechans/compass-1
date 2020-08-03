import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Input} from "../input";
import {ActionMeta} from "react-select/src/types";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {Trans} from "@lingui/macro";
import {WorkspacePipelineTaskBinding} from "../../api/endpoints";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

export const workspacePipelineTaskBinding: WorkspacePipelineTaskBinding = {
  name: "",
  workspace: "",
};

@observer
export class PipelineTaskWorkSpaces extends React.Component<Props> {
  @observable value: WorkspacePipelineTaskBinding[] = this.props.value || [];

  add = () => {
    this.value.push(workspacePipelineTaskBinding);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  render() {
    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>WorkSpaces</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>

            </>
          }>
        </SubTitle>
        {this.value.map((item, index) => {
          return (
            <div>
              <div key={index}>
                <Grid container spacing={5}>
                  <Grid item xs={5}>
                    <Input
                      placeholder={"Name"}
                      value={this.value[index].name}
                      onChange={(value) => (this.value[index].name = value)}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Input
                      placeholder={"workspace"}
                      value={this.value[index].workspace}
                      onChange={(value) =>
                        (this.value[index].workspace = value)
                      }
                    />
                  </Grid>
                  <Grid item xs>
                    <Icon
                      small
                      tooltip={<Trans>Remove</Trans>}
                      className="remove-icon"
                      material="clear"
                      onClick={(e) => {
                        this.remove(index);
                        e.stopPropagation();
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
              <br/>
            </div>
          );
        })}
      </>
    );
  }
}
