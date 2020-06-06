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
import {ContainerDetails, VolumeClaimTemplates} from "../container-dialog";
import {Button} from "../button";

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
    @observable step: number = 1;

    static open() {
        CopyAddDeployDialog.isOpen = true;
    }

    static close() {
        CopyAddDeployDialog.isOpen = false;
    }

    close = () => {
        CopyAddDeployDialog.close();
        this.forms = [];
        this.step = 1;
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

    addContainer = () => {
        this.forms.push({});
    }

    removeContainer = () => {
        this.forms.splice(this.step - 1, 1);
    }

    addDeployDialog = async () => {

    }

    render() {
        const {className, showIcons, showClusterOption, clusterOptionLabel, customizeOptions, ...selectProps} = this.props;
        const header = <h5><Trans>Apply Deploy Workload {this.step}</Trans></h5>;

        const moreButtons = (
            <div className="">
                <Button primary onClick={this.addContainer}><Trans>Add container</Trans></Button>
                {
                    this.forms.length > 0 ?
                        <>
                            &nbsp;
                            <Button primary onClick={this.removeContainer}><Trans>Remove container</Trans></Button>
                        </>: <></>
                }
            </div>
        )

        return (
            <Dialog
                isOpen={CopyAddDeployDialog.isOpen}
                close={this.close}
            >
                <Wizard className="CopyAddDeployDialog" header={header} done={this.close}
                        step={this.step} onChange={(step) => (this.step = step)}>
                    <WizardStep
                        contentClass="flex gaps column" nextLabel={<Trans>Next</Trans>} moreButtons={moreButtons}>
                        <div className="init-form">
                            <Select
                                formatOptionLabel={this.formatOptionLabel}
                                options={this.typeOptions}
                                value={this.type}
                                onChange={v => this.type = v}
                                {...selectProps}
                            />
                            <SubTitle title={<Trans>Field name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                value={this.name}
                                onChange={v => this.name = v}
                            />
                        </div>
                    </WizardStep>
                    {
                        this.forms.map((item, index) => {
                            return (
                                <WizardStep
                                    contentClass="flex gaps column" moreButtons={moreButtons} noValidate={true}>
                                    <ContainerDetails
                                        base={true}
                                        commands={true}
                                        args={true}
                                        environment={true}
                                        readyProbe={true}
                                        liveProbe={true}
                                        lifeCycle={true}
                                        divider={true}
                                        onChange={(value: any) => console.log(value)}/>
                                </WizardStep>
                            )
                        })
                    }
                </Wizard>
            </Dialog>
        )
    }
}