import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { Input } from "../input";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Divider } from "antd";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";
import { WorkspacePipelineDeclaration } from "../../api/endpoints/tekton-pipeline.api";
import { Col, Row } from "../grid";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
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
        <SubTitle className="fields-title" title="WorkSpaces">
          {this.renderAdd()}
        </SubTitle>
        <div className="Workspaces">
          {this.value.map((item, index) => {
            return (
              <>
                <div key={index}>
                  <Row>
                    <Col span={10} offset={1}>
                      <Input
                        placeholder={"Name"}
                        value={this.value[index].name}
                        onChange={(value) => (this.value[index].name = value)}
                      />
                    </Col>
                    <Col span={10} offset={1}>
                      <Input
                        placeholder={"Description"}
                        value={this.value[index].description}
                        onChange={(value) =>
                          (this.value[index].description = value)
                        }
                      />
                    </Col>

                    <Col span={1} offset={1}>
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
}
