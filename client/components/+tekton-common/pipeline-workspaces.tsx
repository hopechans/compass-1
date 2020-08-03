import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { Input } from "../input";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";
import { WorkspacePipelineDeclaration } from "../../api/endpoints";
import {Grid} from "@material-ui/core";

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

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`WorkSpaces`)}
        material="edit"
        onClick={(e) => {
          this.add();
          e.stopPropagation();
        }}
      />
    );
  }

  render() {
    return (
      <div>
        <SubTitle className="fields-title" title="WorkSpaces">
          {this.renderAdd()}
        </SubTitle>
        <div className="Workspaces">
          {this.value.map((item, index) => {
            return (
              <>
                <div key={index}>
                  <Grid container spacing={5}>
                    <Grid item xs>
                      <Input
                        placeholder={"Name"}
                        value={this.value[index].name}
                        onChange={(value) => (this.value[index].name = value)}
                      />
                    </Grid>
                    <Grid item xs>
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
                        tooltip={<Trans>Remove Workspaces</Trans>}
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
                <br />
              </>
            );
          })}
        </div>
      </div>
    );
  }
}
