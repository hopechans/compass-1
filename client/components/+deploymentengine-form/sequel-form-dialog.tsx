import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Form} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {FRender} from "../ali-formrender";

interface Props extends Partial<DialogProps> {
}


@observer
export class SequelFormDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static data: Form = null;

    @observable propsSchema: {};
    @observable formData: {};
    @observable name = "";

    static open(form: Form) {
        SequelFormDialog.isOpen = true;
        SequelFormDialog.data = form;
    }

    static close() {
        SequelFormDialog.isOpen = false;
    }

    get field() {
        return SequelFormDialog.data;
    }

    onOpen = () => {
        const {field} = this;
        this.propsSchema = {type: "object", properties: field.spec.props_schema};
        this.formData = {};
        this.name = field.getName();
    }

    close = () => {
        SequelFormDialog.close();
    }

    reset = () => {
        this.propsSchema = {};
        this.formData = {};
        this.name = "";
    }

    render() {
        const header = <h5><Trans>Sequel Form</Trans></h5>;
        return (
            <Dialog
                className="SequelFormDialog"
                isOpen={SequelFormDialog.isOpen}
                onOpen={this.onOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column">
                        <FRender
                            propsSchema={this.propsSchema}
                            formData={this.formData}
                            onChange={(values: any) => {
                                this.formData = values
                            }}
                        />
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}