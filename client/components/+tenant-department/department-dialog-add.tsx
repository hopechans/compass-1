
import React from 'react'
import { observer,inject} from 'mobx-react'
import { observable, action, computed} from 'mobx'
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";
import { Dialog, DialogProps } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Input } from "../input";
import { SubTitle } from "../layout/sub-title";
import { systemName } from "../input/input.validators";
import { Notifications } from "../notifications";
import { tenantDepartmentApi } from '../../api/endpoints/tenant-department.api'
import { TenantDepartment } from "../../api/endpoints/tenant-department.api";
import { departmentStore } from './department.store'
import {autobind,prevDefault} from '../../utils'


interface Props extends Partial<DialogProps> {
}


@observer
export class AddDepartmentDialog extends React.Component<Props>{
    @observable static isOpen = false;
    @observable deptname = "";

    static open(){
        AddDepartmentDialog.isOpen = true
    }

    static close(){
        AddDepartmentDialog.isOpen = false
        departmentStore.clean()
    }

    reset = () => {
        this.deptname = "";
    }

    close = () => {
        AddDepartmentDialog.close();
    }

    createDepartment = async () => {
        const { deptname } = this;
        try {
            await tenantDepartmentApi.createApi()
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render(){
        const { deptname } = this;
        const creatHeader = <h5 ><Trans >Create Department</Trans></h5>;
        const editHeader = <h5 ><Trans >Edit Department</Trans></h5>;
        const name = departmentStore.deptName ? departmentStore.deptName : ''
        const dialogType = departmentStore.dialogType
        const header = dialogType === 'edit' ? editHeader :creatHeader
        
        return(
            <Dialog
                className="AddDepartmentDialog"
                isOpen={AddDepartmentDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createDepartment}>
                        <div className="secret-username">
                            <SubTitle title={<Trans>name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                validators={systemName}
                                value={name} onChange={v => departmentStore.changeItemName(v)}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}