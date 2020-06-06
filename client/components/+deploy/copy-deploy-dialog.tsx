import "./copy-deploy-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {number, t, Trans} from "@lingui/macro";
import {Wizard, WizardStep} from "../wizard";
import {Select, SelectOption, SelectProps} from "../select";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {ContainerDetails, VolumeClaimTemplates} from "./container-details";

interface Props extends SelectProps {
    showIcons?: boolean;
    showClusterOption?: boolean; // show cluster option on the top (default: false)
    clusterOptionLabel?: React.ReactNode; // label for cluster option (default: "Cluster")
    customizeOptions?(nsOptions: SelectOption[]): SelectOption[];
}

export interface DeployTemplate {
    type: string,
    name: string,
    strategy: string,
    forms: any[],
    volumeClaimTemplates: VolumeClaimTemplates,
}

@observer
export class CopyAddDeployDialog extends React.Component<Props> {


    @observable static isOpen = false;
    @observable type: string = "Stone";
    @observable strategy: string = "";
    @observable name: string = "appName";
    @observable forms: Array<any> = [];

    static open() {
        CopyAddDeployDialog.isOpen = true;
    }

    static close() {
        CopyAddDeployDialog.isOpen = false;
    }

    close = () => {
        CopyAddDeployDialog.close();
    }

    get typeOptions() {
        return [
            "Stone",
            "Water",
            "Deployment",
            "Statefulset"
        ]
    }

    formatOptionLabel = (option: SelectOption) => {
        const {showIcons} = this.props;
        const {value, label} = option;
        return label || (
            <>
                {showIcons && <Icon small material="layers"/>}
                {value}
            </>
        );
    }

    addDeployDialog = async () => {

    }


    render() {
        const {className, showIcons, showClusterOption, clusterOptionLabel, customizeOptions, ...selectProps} = this.props;
        const header = <h5><Trans>Apply Deploy Workload</Trans></h5>;

        return (
            <Dialog
                isOpen={CopyAddDeployDialog.isOpen}
                close={this.close}
            >
                <Wizard className="CopyAddDeployDialog" header={header} done={this.close}>
                    <WizardStep
                        contentClass="flex gaps column" nextLabel={<Trans>Next</Trans>}>
                        <div className="init-form">
                            <Select
                                formatOptionLabel={this.formatOptionLabel}
                                options={this.typeOptions}
                                value={this.type} onChange={v => this.type = v}
                                {...selectProps}
                            />
                            <SubTitle title={<Trans>Field name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                value={this.name} onChange={v => this.name = v}
                            />
                        </div>
                    </WizardStep>
                    <WizardStep
                        contentClass="flex gaps column" nextLabel={<Trans>Apply</Trans>} next={this.addDeployDialog}>
                        <ContainerDetails/>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}