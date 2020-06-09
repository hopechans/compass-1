import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {computed, observable} from "mobx";
import {
    TenantDepartment,
    tenantDepartmentApi,
    Namespace,
    tenantRoleApi, TenantRole
} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {Select, SelectOption} from "../select";

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
    @observable namespaces = observable.array<Namespace>([], {deep: false});
    @observable defaultNamespace = "";

    close = () => {
        AddDepartmentDialog.close();
    }

    reset = () => {
        this.name = "";
        this.defaultNamespace = "";
        this.namespaces.replace([]);
    }

    @computed get selectedNamespaces() {
        return [
            ...this.namespaces,
        ]
    }

    createDepartment = async () => {
        const {name} = this;
        const department: Partial<TenantDepartment> = {
            spec: {
                namespace: this.selectedNamespaces,
                defaultNamespace: this.defaultNamespace
            }
        }
        const departmentAdminRole: Partial<TenantRole> = {
            spec: {
                value: 15,
                comment: name + '-dept-admin'
            }
        }
        const departmentEmployeeRole: Partial<TenantRole> = {
            spec: {
                value: 1,
                comment: name + '-dept-employee'
            }
        }

        try {
            await tenantDepartmentApi.create({namespace: "kube-system", name: name}, department);
            await tenantRoleApi.create({namespace: "kube-system", name: name + '-dept-admin'}, departmentAdminRole);
            await tenantRoleApi.create({namespace: "kube-system", name: name + '-dept-employee'}, departmentEmployeeRole);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name} = this;
        const unwrapNamespaces = (options: SelectOption[]) => options.map(option => option.value);
        const header = <h5><Trans>Create Department</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddDepartmentDialog"
                isOpen={AddDepartmentDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>}
                                next={this.createDepartment}>
                        <div className="department-name">
                            <SubTitle title={<Trans>Department name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                validators={systemName}
                                value={name} onChange={v => this.name = v}
                            />
                        </div>
                        <div className="namespace">
                            <SubTitle title={<Trans>Namespace</Trans>}/>
                            <NamespaceSelect
                                isMulti
                                value={this.namespaces}
                                placeholder={_i18n._(t`Namespace`)}
                                themeName="light"
                                className="box grow"
                                onChange={(opts: SelectOption[]) => {
                                    if (!opts) opts = [];
                                    this.namespaces.replace(unwrapNamespaces(opts));
                                }}
                            />
                        </div>
                        <div className="default_namespace">
                            <SubTitle title={<Trans>Default Namespace</Trans>}/>
                            <Select
                                value={this.defaultNamespace}
                                placeholder={_i18n._(t`Default Namespace`)}
                                options={this.namespaces}
                                themeName="light"
                                className="box grow"
                                onChange={value => this.defaultNamespace = value.value}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}