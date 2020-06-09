import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {annotations, VolumeClaimTemplate} from "./common";
import {ActionMeta} from "react-select/src/types";
import {Checkbox} from "../checkbox";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {isNumber} from "../input/input.validators";

export interface VolumeClaimProps<T =any> extends Partial<VolumeClaimProps> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";
    divider?:true;
    onChange?(option: T, meta?: ActionMeta): void;
}

@observer
export class VolumeClaimDetails extends React.Component<VolumeClaimProps> {


    @observable value: VolumeClaimTemplate = this.props.value ||  {
        metadata: {
            isUseDefaultStorageClass: true,
            name: "",
            annotations: annotations()
        },
        spec: {
            accessModes: [ "ReadWriteOnce" ],
            storageClassName: "default-storage-class",
            resources: {
                requests: {
                    storage: "200",
                }
            }
        }
    }

    render() {
        return (
            <>
                <Checkbox
                    theme="light"
                    label={<Trans>Use Default StorageClass</Trans>}
                    value={this.value.metadata.isUseDefaultStorageClass}
                    onChange={value => this.value.metadata.isUseDefaultStorageClass = value}
                />
                {
                    !this.value.metadata.isUseDefaultStorageClass ?
                        <>
                            <SubTitle title={<Trans>StorageClassName</Trans>}/>
                            <Input
                                placeholder={_i18n._(t`StorageClassName`)}
                                value={this.value.spec.storageClassName}
                                onChange={value => this.value.spec.storageClassName = value}
                            />
                        </>:<></>
                }
                <SubTitle title={<Trans>Storage</Trans>}/>
                <Input
                    placeholder={_i18n._(t`Storage`)}
                    type="number"
                    validators={isNumber}
                    value={this.value.spec.resources.requests.storage}
                    onChange={value => this.value.spec.resources.requests.storage = value}
                />
            </>
        )
    }
}