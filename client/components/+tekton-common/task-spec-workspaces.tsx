import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { Input } from "../input";
import { ActionMeta } from "react-select/src/types";
import { Select, SelectOption } from "../select";
import { WorkspaceDeclaration as Workspace } from "../../api/endpoints/tekton-task.api";
import { SubTitle } from "../layout/sub-title";
import { Divider } from "antd";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";
import { Col, Row } from "../grid";
import { string } from "yargs";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
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

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`Workspaces`)}
        material="add_circle"
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
                  <Row>
                    <Col span={4}>
                      <Input
                        placeholder={"Name"}
                        value={this.value[index].name}
                        onChange={(value) => (this.value[index].name = value)}
                      />
                    </Col>

                    <Col span={4} offset={1}>
                      <Input
                        placeholder={"Description"}
                        value={this.value[index].description}
                        onChange={(value) =>
                          (this.value[index].description = value)
                        }
                      />
                    </Col>

                    <Col span={4} offset={1}>
                      <Input
                        placeholder={"MountPath"}
                        value={this.value[index].mountPath}
                        onChange={(value) =>
                          (this.value[index].mountPath = value)
                        }
                      />
                    </Col>

                    <Col span={4} offset={1}>
                      {/* <Select
                        value={this.value[index].readOnly}
                        options={this.typeOptions}
                        formatOptionLabel={this.formatOptionLabel}
                        onChange={(value) =>
                          (this.value[index].readOnly = value.value)
                        }
                      /> */}
                      <Input
                        placeholder={"ReadOnly:true/false"}
                        value={
                          this.value[index]?.readOnly === true
                            ? "true"
                            : "false"
                        }
                        onChange={(value) => {
                          if (value.toLowerCase() === "true") {
                            this.value[index].readOnly = true;
                          }
                          if (value.toLowerCase() === "fasle") {
                            this.value[index].readOnly = false;
                          }
                        }}
                      />
                    </Col>

                    <Col span={1} offset={2}>
                      <Icon
                        small
                        tooltip={<Trans>Remove Workspaces</Trans>}
                        className="remove-icon"
                        material="remove_circle"
                        onClick={(e) => {
                          this.remove(index);
                          e.stopPropagation();
                        }}
                      />
                    </Col>
                  </Row>
                </div>
                <br />
              </>
            );
          })}
        </div>
      </>
    );
  }

  // render() {
  //   return (
  //     <div>

  //     </div>
  //   );
  // }
}
