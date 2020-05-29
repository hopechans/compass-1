import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Form, formApi, DataNode} from "../../api/endpoints";
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
export class AddFormDialog extends React.Component<Props> {

    @observable static isOpen = false;

    static open() {
        AddFormDialog.isOpen = true;
    }

    static close() {
        AddFormDialog.isOpen = false;
    }

    @observable name = "";
    @observable namespace = "kube-system";

    close = () => {
        AddFormDialog.close();
    }

    reset = () => {
        this.name = "";
    }

    createForm = async () => {
        const {name, namespace} = this;
        const form: Partial<Form> = {
            spec: {
                tree: [{title: name, key: name, node_type: "array", children: []}],
                props_schema: ""
            }
        }
        try {
            const newField = await formApi.create({namespace, name}, form);
            showDetails(newField.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name} = this;
        const header = <h5><Trans>Create Form</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddFormDialog"
                isOpen={AddFormDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createForm}>
                        <div className="form-name">
                            <SubTitle title={<Trans>Field name</Trans>}/>
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