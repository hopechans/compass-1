import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Input} from "../input";
import {ActionMeta} from "react-select/src/types";
import {SelectOption} from "../select";
import {WorkspaceDeclaration as Workspace} from "../../api/endpoints/tekton-task.api";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {_i18n} from "../../i18n";
import {Grid} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

export const workspaces: Workspace = {
  name: "",
  description: "",
  mountPath: "",
  readOnly: false,
};

@observer
export class TaskSpecWorkSpaces extends React.Component<Props> {
  @observable value: Workspace[] = this.props.value || [];

  get typeOptions() {
    return ["true", "false"];
  }

  add = () => {
    this.value.push(workspaces);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

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

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`Workspaces`)}
        material="add_circle_outline"
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
        <SubTitle className="fields-title" title="Workspaces">
          {this.renderAdd()}
        </SubTitle>
        <div className="Workspaces">
          {this.value.map((item, index) => {
            return (
              <div>
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
                        placeholder={"MountPath"}
                        value={this.value[index].mountPath}
                        onChange={(value) =>
                          (this.value[index].mountPath = value)
                        }
                      />
                    </Grid>
                    <Grid item xs>
                      <Icon
                        small
                        tooltip={<Trans>Remove Workspaces</Trans>}
                        className="remove-icon"
                        material="remove_circle_outline"
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
        </div>
      </div>
    );
  }

}
