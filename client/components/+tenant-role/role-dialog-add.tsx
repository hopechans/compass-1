
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
import { tetantDepartmentApi } from '../../api/endpoints/tenant-department.api'
import { TetantDepartment } from "../../api/endpoints/tenant-department.api";
import { roleStore } from './role.store'
import {autobind,prevDefault} from '../../utils'
interface Props extends Partial<DialogProps> {
}


@observer
export class AddRoleDialog extends React.Component<Props>{
    @observable static isOpen = false;
    @observable roleName = "";

    static open(){
        AddRoleDialog.isOpen = true
    }

    static close(){
        AddRoleDialog.isOpen = false
        roleStore.clean()
    }

    reset = () => {
        this.roleName = "";
    }

    close = () => {
        AddRoleDialog.close();
    }

    createDepartment = async () => {
        const { roleName } = this;
        try {
            await tetantDepartmentApi.createApi()
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render(){
        const { roleName } = this;
        const creatHeader = <h5 ><Trans >Create Department</Trans></h5>;
        const editHeader = <h5 ><Trans >Edit Department</Trans></h5>;
        const name = roleStore.roleName ? roleStore.roleName : ''
        const dialogType = roleStore.dialogType
        const header = dialogType === 'edit' ? editHeader :creatHeader
        
        return(
            <Dialog
                className="AddRoleDialog"
                isOpen={AddRoleDialog.isOpen}
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
                                value={name} onChange={v => roleStore.changeItemName(v)}
                            />
                        </div>
                    
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}