import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Input} from "../input";
import {ActionMeta} from "react-select/src/types";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {_i18n} from "../../i18n";
import {WorkspaceBinding} from "../../api/endpoints";
import {PersistentVolumeClaimVolumeSource} from "../../api/endpoints";
import {Grid} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

export const pvc: PersistentVolumeClaimVolumeSource = {
  claimName: "",
  readOnly: false,
};

export const workspaceBinding: WorkspaceBinding = {
  name: "",
  subPath: "",
  persistentVolumeClaim: pvc,
};

@observer
export class PipelineRunWorkspaces extends React.Component<Props> {
  @observable value: WorkspaceBinding[] = this.props.value || [];

  add = () => {
    this.value.push(workspaceBinding);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`WorkSpaces`)}
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
        <SubTitle className="fields-title" title="WorkSpaces">
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
                        placeholder={"SubPath"}
                        value={this.value[index].subPath}
                        onChange={(value) =>
                          (this.value[index].subPath = value)
                        }
                      />
                    </Grid>

                    <Grid item xs>
                      <Input
                        placeholder={"PersistentVolumeClaimName"}
                        value={
                          this.value[index].persistentVolumeClaim.claimName
                        }
                        onChange={(value) =>
                          (this.value[
                            index
                            ].persistentVolumeClaim.claimName = value)
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
