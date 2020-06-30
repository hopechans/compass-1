import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { Input } from "../input";
import { ActionMeta } from "react-select/src/types";
import { workspace, Workspace } from "./common";
import { SubTitle } from "../layout/sub-title";
import { Divider } from "antd";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class WorkspacesDetails extends React.Component<Props> {
  @observable value: Workspace[] = this.props.value || [];

  add = () => {
    this.value.push(workspace);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
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
      <>
        {this.props.divider ? <Divider /> : <></>}
        <SubTitle className="fields-title" title="Workspaces">
          {this.renderAdd()}
        </SubTitle>
        <div className="Workspaces">
          {this.value.map((item, index) => {
            return (
              <>
                <div key={index}>
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
                  <br />
                  <br />
                  <SubTitle title={"Name"} />
                  <Input
                    placeholder={"Name"}
                    value={this.value[index].name}
                    onChange={(value) => (this.value[index].name = value)}
                  />
                  <br />
                  <SubTitle title={"Description"} />
                  <Input
                    placeholder={"Description"}
                    value={this.value[index].description}
                    onChange={(value) =>
                      (this.value[index].description = value)
                    }
                  />
                  <br />
                  <SubTitle title={"MountPath"} />
                  <Input
                    placeholder={"MountPath"}
                    value={this.value[index].mountPath}
                    onChange={(value) => (this.value[index].mountPath = value)}
                  />
                </div>
                <br />
              </>
            );
          })}
        </div>
      </>
    );
  }
}
