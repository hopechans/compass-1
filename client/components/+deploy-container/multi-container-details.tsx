import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {Button} from "../button";
import {Collapse, Popconfirm} from "antd";
import {ContainerDetails} from "./container-details";
import {observable} from "mobx";
import {DeleteOutlined} from '@ant-design/icons';
import {container, Container} from "./common";

const {Panel} = Collapse;

interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(option: T, meta?: ActionMeta): void;

    base?: boolean;
    commands?: boolean;
    args?: boolean;
    environment?: boolean;
    readyProbe?: boolean;
    liveProbe?: boolean;
    lifeCycle?: boolean;
    divider?: true;
}

@observer
export class MultiContainerDetails extends React.Component<Props> {

    @observable value: Container[] = this.props.value || [container];

    add() {
        this.value.push(container);
    }

    remove(index: number) {
        this.value.splice(index, 1)
    }

    render() {

        const genExtra = (index: number) => {
            if (this.value.length > 1) {
                return (
                    <Popconfirm
                        title="Confirm Delete?"
                        onConfirm={(event: any) => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.remove(index);
                        }}
                        onCancel={(event: any) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                        okText="Yes"
                        cancelText="No">
                        <DeleteOutlined
                            translate style={{color: '#ff4d4f'}}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                        />
                    </Popconfirm>
                )
            }
            return (<></>)
        }

        return (
            <>
                <Button primary onClick={() => this.add()}><span>Addition Container</span></Button>
                <br/><br/>
                <Collapse>
                    {this.value.map((item, index) => {
                        return (
                            <Panel header={`Container`} key={index} extra={genExtra(index)}>
                                <ContainerDetails
                                    base={this.props.base}
                                    commands={this.props.commands} args={this.props.args}
                                    environment={this.props.environment}
                                    readyProbe={this.props.readyProbe} liveProbe={this.props.liveProbe}
                                    lifeCycle={this.props.lifeCycle}
                                    divider={this.props.divider}
                                    value={this.value[index]}
                                    onChange={(value: any) => { this.value[index] = value }}
                                />
                            </Panel>
                        )
                    })}
                </Collapse>
            </>
        )
    }
}