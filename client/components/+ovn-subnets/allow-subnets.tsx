import { ActionMeta } from "react-select/src/types";
import { observer } from "mobx-react";
import React from "react";
import { SubTitle } from "../layout/sub-title";
import { Icon } from "../icon";
import { _i18n } from "../../i18n";
import { t, Trans } from "@lingui/macro";
import { Input } from "../input";
import { observable } from "mobx";
import { Col, Row } from "antd";

interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";
    divider?: true;
    onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class AllowSubnets extends React.Component<Props> {

    @observable value: string[] = this.props.value || [];

    add = () => {
        this.value.push("");
    }

    remove = (index: number) => {
        this.value.splice(index, 1);
    }

    renderAdd() {
        return (
            <Icon
                small
                tooltip={_i18n._(t`CIDR`)}
                material="add_circle_outline"
                onClick={(e) => {
                    this.add();
                    e.stopPropagation();
                }}
            />
        )
    }

    render() {

        return (
            <>
                <SubTitle className="fields-title" title="AllowSubnets">{this.renderAdd()}</SubTitle>
                <div className="allowSubnets">
                    {this.value.map((item, index) => {
                        return (
                            <div key={index}>
                                <Row >
                                    <Col span="23">
                                        <Input
                                            className="item"
                                            required={true}
                                            placeholder={_i18n._(t`CIDR`)}
                                            title={this.value[index]}
                                            value={this.value[index]}
                                            onChange={value => { this.value[index] = value }}
                                        />
                                    </Col>
                                    <Col span="1">
                                        <Icon
                                            small
                                            tooltip={<Trans>Remove Subnet</Trans>}
                                            className="remove-icon"
                                            material="remove_circle_outline"
                                            onClick={(e) => { this.remove(index); e.stopPropagation() }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }
}