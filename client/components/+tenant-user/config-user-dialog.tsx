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
import {Notifications} from "../notifications";
import {BaseDepartmentSelect} from "../+tenant-department/department-select";

interface Props extends Partial<DialogProps> {
}

@observer
export class ConfigUserDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static data: TenantUser = null;
    @observable name = "";
    @observable namespace = "kube-system";
    @observable display = "";
    @observable email = "";
    @observable department_id = "";

    static open(user: TenantUser) {
        ConfigUserDialog.isOpen = true;
        ConfigUserDialog.data = user;
    }

    static close() {
        ConfigUserDialog.isOpen = false;
    }

    close = () => {
        ConfigUserDialog.close();
    }

    get user() {
        return ConfigUserDialog.data;
    }

    onOpen = () => {
        this.name = this.user.getName();
        this.department_id = this.user.spec.department_id;
        this.display = this.user.spec.display;
        this.email = this.user.spec.email;
    }

    reset = () => {
        this.name = "";
        this.email = "";
        this.display = "";
        this.department_id = "";
    }

    updateUser = async () => {
        const {name, namespace, department_id, display, email} = this;
        const user: Partial<TenantUser> = {
            spec: {
                name: name,
                display: display,
                email: email,
                password: "",
                department_id: department_id,
            }
        }
        try {
            const newUser = await tenantUserApi.create({namespace, name}, user);
            // showDetails(newUser.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {display, email, department_id} = this;
        const header = <h5><Trans>Update User</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="ConfigUserDialog"
                isOpen={ConfigUserDialog.isOpen}
                onOpen={this.onOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Apply</Trans>} next={this.updateUser}>
                        <div className="tenant-department">
                            <SubTitle title={<Trans>Tenant Department</Trans>}/>
                            <BaseDepartmentSelect
                                placeholder={_i18n._(t`Tenant Department`)}
                                themeName="light"
                                className="box grow"
                                value={department_id} onChange={({value}) => this.department_id = value}
                            />
                        </div>
                        <div className="display">
                            <SubTitle title={<Trans>Display</Trans>}/>
                            <Input
                                placeholder={_i18n._(t`Display`)}
                                value={display} onChange={v => this.display = v}
                            />
                        </div>
                        <div className="email">
                            <SubTitle title={<Trans>Email</Trans>}/>
                            <Input
                                placeholder={_i18n._(t`Email`)}
                                value={email} onChange={v => this.email = v}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}