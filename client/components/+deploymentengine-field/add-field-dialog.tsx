import "./add-field-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Field, fieldApi} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Select, SelectOption} from "../select";
import {Notifications} from "../notifications";
import {showDetails} from "../../navigation";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddFieldDialog extends React.Component<Props> {

    @observable static isOpen = false;

    static open() {
        AddFieldDialog.isOpen = true;
    }

    static close() {
        AddFieldDialog.isOpen = false;
    }

    @observable name = "";
    @observable field_type = "string";
    @observable namespace = "kube-system";

    close = () => {
        AddFieldDialog.close();
    }

    reset = () => {
        this.name = "";
        this.field_type = "string";
    }

    get types() {
        return [
            "string",
            "number",
            "boolean",
        ]
    }

    createField = async () => {
        const {name, namespace, field_type} = this;
        const field: Partial<Field> = {
            spec: {
                field_type: field_type,
                form_data_config: "{}",
                props_schema: "{}"
            }
        }
        try {
            const newField = await fieldApi.create({namespace, name}, field);
            showDetails(newField.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name, field_type} = this;
        const header = <h5><Trans>Create Field</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddSecretDialog"
                isOpen={AddFieldDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createField}>
                        <div className="field-name">
                            <SubTitle title={<Trans>Field name</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                validators={systemName}
                                value={name} onChange={v => this.name = v}
                            />
                        </div>
                        <div className="field-type">
                            <SubTitle title={<Trans>Field type</Trans>}/>
                            <Select
                                themeName="light"
                                options={this.types}
                                value={field_type} onChange={({value}: SelectOption) => this.field_type = value}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}