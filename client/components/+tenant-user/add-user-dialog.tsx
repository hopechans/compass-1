import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {TenantUser, tenantUserApi} from "../../api/endpoints";
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
export class AddUserDialog extends React.Component<Props> {

    @observable static isOpen = false;

    static open() {
        AddUserDialog.isOpen = true;
    }

    static close() {
        AddUserDialog.isOpen = false;
    }

    @observable name = "";
    @observable namespace = "";

    close = () => {
        AddUserDialog.close();
    }

    reset = () => {
        this.name = "";
    }

    createUser = async () => {
        const {name, namespace} = this;
        const user: Partial<TenantUser> = {}
        try {
            const newUser = await tenantUserApi.create({namespace, name}, user);
            showDetails(newUser.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name} = this;
        const header = <h5><Trans>Create User</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddUserDialog"
                isOpen={AddUserDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createUser}>
                        <div className="user-name">
                            <SubTitle title={<Trans>User name</Trans>}/>
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