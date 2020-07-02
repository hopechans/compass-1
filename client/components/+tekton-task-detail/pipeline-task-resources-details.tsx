import { observer } from "mobx-react";
import React from "react";
import { observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { Input } from "../input";
import { PipelineTaskInputResource } from "../../api/endpoints/tekton-pipeline.api";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { Col, Row } from "../grid";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  title?: string;
  onChange?(option: T, meta?: ActionMeta): void;
}

export const pipelineTaskInputResource: PipelineTaskInputResource = {
  name: "",
  resource: "",
};

@observer
export class PipelineTaskInputResourceDetail extends React.Component<Props> {
  static defaultProps = { title: "Pipeline Resources" };
  @observable value: PipelineTaskInputResource[] = this.props.value || [];

  add = () => {
    this.value.push(pipelineTaskInputResource);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  render() {
    const { title } = this.props;
    return (
      <div className="params">
        <SubTitle className="fields-title" title={title}>
          <Icon
            small
            tooltip={_i18n._(t`resource`)}
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
              <Col span={12}>
                <Trans>Name</Trans>
              </Col>
              <Col span={12}>
                <Trans>Resource</Trans>
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
                <Col span={10}>
                  <Input
                    placeholder={_i18n._(t`Name`)}
                    value={this.value[index].name}
                    onChange={(value) => {
                      this.value[index].name = value;
                      console.log(this.value[index].name);
                    }}
                  />
                </Col>
                <Col span={10} offset={1}>
                  <Input
                    placeholder={_i18n._(t`Value`)}
                    value={this.value[index].resource}
                    onChange={(value) => (this.value[index].resource = value)}
                  />
                </Col>
                <Col span={1} offset={1}>
                  <Icon
                    small
                    material="remove_circle_outline"
                    onClick={(e) => {
                      this.remove(index);
                      e.stopPropagation();
                    }}
                  />
                </Col>
              </Row>
              <br></br>
            </>
          );
        })}
      </div>
    );
  }
}
