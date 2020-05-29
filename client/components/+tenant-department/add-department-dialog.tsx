import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {TenantDepartment, tenantDepartmentApi} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {showDetails} from "../../navigation";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddDepartmentDialog extends React.Component<Props> {

    @observable static isOpen = false;

    static open() {
        AddDepartmentDialog.isOpen = true;
    }

    static close() {
        AddDepartmentDialog.isOpen = false;
    }

    @observable name = "";
    @observable namespace = "";

    close = () => {
        AddDepartmentDialog.close();
    }

    reset = () => {
        this.name = "";
    }

    createDepartment = async () => {
        const {name, namespace} = this;
        const department: Partial<TenantDepartment> = {}
        try {
            const newDepartment = await tenantDepartmentApi.create({namespace, name}, department);
            showDetails(newDepartment.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name} = this;
        const header = <h5><Trans>Create Department</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddDepartmentDialog"
                isOpen={AddDepartmentDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createDepartment}>
                        <div className="department-name">
                            <SubTitle title={<Trans>Department name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                validators={systemName}
                                value={name} onChange={v => this.name = v}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}