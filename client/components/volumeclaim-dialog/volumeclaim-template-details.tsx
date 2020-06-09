import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {annotations, VolumeClaimTemplate} from "./common";
import {Checkbox} from "../checkbox";
import {number, t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {isNumber} from "../input/input.validators";
import {ActionMeta} from "react-select/src/types";
import {Button} from "../button";
import {Collapse, Popconfirm} from "antd";
const {Panel} = Collapse;
import {DeleteOutlined} from '@ant-design/icons';
import {VolumeClaimDetails} from "./volumeclaim-details";


export interface VolumeClaimTemplateProps<T = any> extends Partial<VolumeClaimTemplateProps> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";
    divider?: true;

    onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class VolumeClaimTemplateDetails extends React.Component<VolumeClaimTemplateProps> {


    @observable value: VolumeClaimTemplate[] = this.props.value || [{
        metadata: {
            isUseDefaultStorageClass: true,
            name: "",
            annotations: annotations()
        },
        spec: {
            accessModes: ["ReadWriteOnce"],
            storageClassName: "default-storage-class",
            resources: {
                requests: {
                    storage: "200",
                }
            }
        }
    }]

    add = () => {
        this.value.push(
            {
                metadata: {
                    isUseDefaultStorageClass: true,
                    name: "",
                    annotations: annotations()
                },
                spec: {
                    accessModes: ["ReadWriteOnce"],
                    storageClassName: "default-storage-class",
                    resources: {
                        requests: {
                            storage: "200",
                        }
                    }
                }
            }
        )
    }

    render() {

        const genExtra = (index: number) => {
            return (
                <Popconfirm
                    title="Confirm Delete?"
                    onConfirm={(event: any) => {
                        event.preventDefault()
                        event.stopPropagation()
                        this.value.splice(index, 1)
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

        return (
            <>
                <br/>
                <Button primary onClick={() => this.add()}><span>Addition VolumeClaim</span></Button>
                <br/><br/>
                <Collapse>
                    {this.value.map((item, index) => {
                        return (
                            <Panel header={`VolumeClaim`} key={index} extra={genExtra(index)}>
                                <VolumeClaimDetails
                                    value={this.value[index]} onChange={value => this.value[index] = value}/>
                            </Panel>
                        )
                    })}
                </Collapse>
            </>
        )
    }
}