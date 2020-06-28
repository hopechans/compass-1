import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { taskResources, ResourceDeclaration } from "./common";
import { Col, Row } from "antd";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { Input } from "../input";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class TaskResourceDetails extends React.Component<Props> {
  @observable value: ResourceDeclaration[] = this.props.value || [];

  add = () => {
    this.value.push(taskResources);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  get typeOptions() {
    return ["image", "git"];
  }

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

  render() {
    return (
      <div className="Resource">
        <SubTitle className="fields-title" title="   Add Pipeline Resources">
          <Icon
            small
            tooltip={_i18n._(t`Command`)}
            material="add_circle_outline"
            onClick={(e) => {
              this.add();
              e.stopPropagation();
            }}
          />
        </SubTitle>
        {this.value.length > 0 ? (
          <>
            <Row>
              <Col span={9}>
                <Trans>Name</Trans>
              </Col>
              <Col span={9} offset={2}>
                <Trans>ResourceType</Trans>
              </Col>
            </Row>
            <br />
          </>
        ) : (
          <></>
        )}

        {this.value.map((item, index) => {
          return (
            <>
              <Row>
                <Col span={3} offset={1}>
                  <Input
                    placeholder={"name"}
                    value={this.value[index].name}
                    onChange={(value) => (this.value[index].name = value)}
                  />
                </Col>

                <Col span={3} offset={2}>
                  <Select
                    value={this.value[index].type}
                    options={this.typeOptions}
                    formatOptionLabel={this.formatOptionLabel}
                    onChange={(value) => (this.value[index].type = value.value)}
                  />
                </Col>
                <Col span={5} offset={7}>
                  <Input
                    placeholder={"targetpath"}
                    value={this.value[index].targetPath}
                    onChange={(value) => (this.value[index].targetPath = value)}
                  />
                </Col>
                <Col span={1} offset={1}>
                  <Icon
                    small
                    material="remove_circle_outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.remove(index);
                    }}
                  />
                </Col>
              </Row>
              <br />
            </>
          );
        })}
      </div>
    );
  }
}
