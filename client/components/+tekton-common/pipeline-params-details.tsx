import { observer } from "mobx-react";
import React from "react";
import { observable, toJS } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { Input } from "../input";
import { PipelineParams, pipelineParams } from "./common";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { Col, Row } from "../grid";
import { Select } from "../select";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class PipelineParamsDetails extends React.Component<Props> {
  @observable value: PipelineParams[] = this.props.value || [];

  get Options() {
    return ["string", "array"];
  }

  add = () => {
    this.value.push(pipelineParams);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  render() {
    return (
      <div className="params">
        <SubTitle className="fields-title" title="Pipeline Params">
          <Icon
            small
            tooltip={_i18n._(t`Add`)}
            material="add_circle_outline"
            onClick={(e) => {
              this.add();
              e.stopPropagation();
            }}
          />
        </SubTitle>
        {this.value.length > 0 ? (
          <div>
            <Row>
              <Col span={7}>
                <Trans>Name</Trans>
              </Col>
              <Col span={7} offset={1}>
                <Trans>Type</Trans>
              </Col>
              {/* <Col span={4} offset={2}>
                <Trans>Description</Trans>
              </Col> */}
              <Col span={7} offset={1}>
                <Trans>Default</Trans>
              </Col>
            </Row>
            <br />
          </div>
        ) : (
          <></>
        )}
        {this.value.map((item, index) => {
          return (
            <div>
              <Row>
                <Col span={7}>
                  <Input
                    value={this.value[index].name}
                    onChange={(value) => (this.value[index].name = value)}
                  />
                </Col>
                <Col span={7} offset={1}>
                  <Select
                    value={this.value[index].type}
                    options={this.Options}
                    onChange={(value) => {
                      let result = toJS(value);
                      this.value[index].type = result.value;
                    }}
                  />
                </Col>
                {/* <Col span={4} offset={2}>
                  <Input
                    value={this.value[index].description}
                    onChange={(value) =>
                      (this.value[index].description = value)
                    }
                  />
                </Col> */}
                <Col span={6} offset={1}>
                  <Input
                    value={this.value[index].default}
                    onChange={(value) => (this.value[index].default = value)}
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
              <br />
            </div>
          );
        })}
      </div>
    );
  }
}
