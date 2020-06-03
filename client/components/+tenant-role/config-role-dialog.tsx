import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Namespace, TenantRole, tenantRoleApi} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {BasePermissionSelect} from "./permission-select";
import {tenantPermissionTransferStore} from "./permission.store";
import {apiPermission} from "../../api";
import {SelectOption} from "../select";

interface Props extends Partial<DialogProps> {
}

@observer
export class ConfigRoleDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static value = 0;
    @observable static data: TenantRole = null;
    @observable value = 0;
    @observable name = "";
    @observable namespace = "kube-system";
    @observable permissions = observable.array<string>([], {deep: false});

    static open(object: TenantRole) {
        ConfigRoleDialog.isOpen = true;
        ConfigRoleDialog.data = object
    }

    static close() {
        ConfigRoleDialog.isOpen = false;
    }

    close = () => {
        ConfigRoleDialog.close();
    }

    reset = () => {
        this.name = "";
    }

    get tenantRole () {
        return ConfigRoleDialog.data
    }

    onOpen = async () => {
        this.name = this.tenantRole.getName();
        this.value = this.tenantRole.spec.value;
        await tenantPermissionTransferStore.loadAll(this.value);
        this.permissions = tenantPermissionTransferStore.items;
    }

    unwrapPermissions = (options: string[]) => options.map(option => option);

    updateRole = async () => {
        const {name, namespace, permissions} = this;
        const data = permissions.map(item => item)
        await apiPermission.post("/permission_auth_value/", {data}).then((value: number) => this.value = value)
        const role: Partial<TenantRole> = {
            spec: {
                value: this.value,
            }
        }
        try {
            const newRole = await tenantRoleApi.create({namespace, name}, role);
            // showDetails(newRole.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name, permissions} = this;

        const header = <h5><Trans>Config Role</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="ConfigRoleDialog"
                isOpen={ConfigRoleDialog.isOpen}
                onOpen={this.onOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.updateRole}>
                        <div className="name">
                            <SubTitle title={<Trans>Name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                validators={systemName}
                                value={name} onChange={v => this.name = v}
                            />
                        </div>
                        <div className="namespace">
                            <SubTitle title={<Trans>Permission</Trans>}/>
                            <BasePermissionSelect
                                isMulti
                                value={this.permissions}
                                placeholder={_i18n._(t`Permission`)}
                                themeName="light"
                                className="box grow"
                                onChange={(opts: string[]) => {
                                    if (!opts) opts = [];
                                    this.permissions.replace(this.unwrapPermissions(opts));
                                }}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}