import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Input} from "../input";
import {ActionMeta} from "react-select/src/types";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {_i18n} from "../../i18n";
import {WorkspacePipelineDeclaration} from "../../api/endpoints";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

export const workspacePipelineDeclaration: WorkspacePipelineDeclaration = {
  name: "",
  description: "",
};

@observer
export class PipelineWorkspaces extends React.Component<Props> {
  @observable value: WorkspacePipelineDeclaration[] = this.props.value || [];

  add = () => {
    this.value.push(workspacePipelineDeclaration);
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
            <>
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
                    placeholder={"Description"}
                    value={this.value[index].description}
                    onChange={(value) =>
                      (this.value[index].description = value)
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
              <br/>
            </>
          );
        })}
      </>
    );
  }
}
