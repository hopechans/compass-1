import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {TenantPermission, tenantPermissionApi} from "../../api/endpoints";
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
export class AddPermissionDialog extends React.Component<Props> {

    @observable static isOpen = false;

    static open() {
        AddPermissionDialog.isOpen = true;
    }

    static close() {
        AddPermissionDialog.isOpen = false;
    }

    @observable name = "";
    @observable namespace = "";

    close = () => {
        AddPermissionDialog.close();
    }

    reset = () => {
        this.name = "";
    }

    createRole = async () => {
        const {name, namespace} = this;
        const permission: Partial<TenantPermission> = {}

        try {
            const newPermission = await tenantPermissionApi.create({namespace, name}, permission);
            showDetails(newPermission.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name} = this;
        const header = <h5><Trans>Create Permission</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddPermissionDialog"
                isOpen={AddPermissionDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createRole}>
                        <div className="permission-name">
                            <SubTitle title={<Trans>Permission name</Trans>}/>
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