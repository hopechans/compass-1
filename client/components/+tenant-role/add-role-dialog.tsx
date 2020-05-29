import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {TenantRole, tenantRoleApi} from "../../api/endpoints";
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
export class AddRoleDialog extends React.Component<Props> {

    @observable static isOpen = false;

    static open() {
        AddRoleDialog.isOpen = true;
    }

    static close() {
        AddRoleDialog.isOpen = false;
    }

    @observable name = "";
    @observable namespace = "";

    close = () => {
        AddRoleDialog.close();
    }

    reset = () => {
        this.name = "";
    }

    createRole = async () => {
        const {name, namespace} = this;
        const role: Partial<TenantRole> = {}
        try {
            const newRole = await tenantRoleApi.create({namespace, name}, role);
            showDetails(newRole.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name} = this;
        const header = <h5><Trans>Create Role</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddRoleDialog"
                isOpen={AddRoleDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createRole}>
                        <div className="role-name">
                            <SubTitle title={<Trans>Role name</Trans>}/>
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