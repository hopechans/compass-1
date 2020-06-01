import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {TenantDepartment, tenantDepartmentApi, namespacesApi} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {NamespaceSelect} from "../+namespaces/namespace-select";

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
        this.namespace = "";
    }

    createDepartment = async () => {
        const {name, namespace} = this;
        const department: Partial<TenantDepartment> = {
            spec: {
                namespace: namespace
            }
        }
        try {
            await tenantDepartmentApi.create({namespace:"kube-system", name:name}, department);
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
                        <div className="namespace">
                            <SubTitle title={<Trans>Namespace</Trans>}/>
                            <NamespaceSelect
                                value={this.namespace}
                                placeholder={_i18n._(t`Namespace`)}
                                themeName="light"
                                className="box grow"
                                onChange={({ value }) => this.namespace = value}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}