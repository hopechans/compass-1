import React from 'react'
import {observer, inject} from 'mobx-react'
import {observable, action, computed} from 'mobx'
import {t, Trans} from "@lingui/macro";
import {_i18n} from "../../i18n";
import {Dialog, DialogProps} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {Input} from "../input";
import {SubTitle} from "../layout/sub-title";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {TenantMember, tenantMemberApi} from "../../api/endpoints/tenant-member.api";
import {memberStore} from './member.store'
import {autobind, prevDefault} from '../../utils'


interface Props extends Partial<DialogProps> {
}


@observer
export class AddMemberDialog extends React.Component<Props> {
    @observable static isOpen = false;
    @observable name = "";

    static open() {
        AddMemberDialog.isOpen = true
    }

    static close() {
        AddMemberDialog.isOpen = false
        memberStore.clean()
    }

    reset = () => {
        this.name = "";
    }

    close = () => {
        AddMemberDialog.close();
    }

    createDepartment = async () => {
        const {name} = this;
        try {
            await tenantMemberApi.list()
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {name} = this;
        const creatHeader = <h5><Trans>Create Member</Trans></h5>;
        const editHeader = <h5><Trans>Edit Member</Trans></h5>;
        const name2 = memberStore.name ? memberStore.name : ''
        const dialogType = memberStore.dialogType
        const header = dialogType === 'edit' ? editHeader : creatHeader

        return (
            <Dialog
                className="AddMemberDialog"
                isOpen={AddMemberDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>}
                                next={this.createDepartment}>
                        <div className="secret-username">
                            <SubTitle title={<Trans>name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                validators={systemName}
                                value={name} onChange={v => memberStore.changeItemName(v)}
                            />
                        </div>

                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}