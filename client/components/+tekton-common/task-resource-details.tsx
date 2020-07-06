import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { taskResources } from "./common";
import { Col, Row } from "../grid";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { Input } from "../input";
import { TaskResource } from "../../api/endpoints";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;
  title?: string;

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class TaskResourceDetails extends React.Component<Props> {
  static defaultProps = { title: "Pipeline Resources" };

  @observable value: TaskResource[] = this.props.value || [];

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
    const { title } = this.props;

    return (
      <div className="Resource">
        <SubTitle className="fields-title" title={title}>
          <Icon
            small
            tooltip={_i18n._(t`resoure`)}
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
              <Col span={6}>
                <Trans>Name</Trans>
              </Col>
              <Col span={6} offset={2}>
                <Trans>ResourceType</Trans>
              </Col>
              <Col span={6} offset={2}>
                <Trans>TargetPath</Trans>
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
                <Col span={6}>
                  <Input
                    placeholder={"Name"}
                    value={this.value[index].name}
                    onChange={(value) => (this.value[index].name = value)}
                  />
                </Col>

                <Col span={6} offset={2}>
                  <Select
                    value={this.value[index].type}
                    options={this.typeOptions}
                    formatOptionLabel={this.formatOptionLabel}
                    onChange={(value) => (this.value[index].type = value.value)}
                  />
                </Col>
                <Col span={6} offset={2}>
                  <Input
                    placeholder={"TargetPath"}
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
