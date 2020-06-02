
import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Field} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {FRender} from "../ali-formrender";

interface Props extends Partial<DialogProps> {
}


@observer
export class SequelFieldDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static data: Field = null;

    @observable propsSchema: {};
    @observable formData: {};
    @observable name = "";

    static open(field: Field) {
        SequelFieldDialog.isOpen = true;
        SequelFieldDialog.data = field;
    }

    static close() {
        SequelFieldDialog.isOpen = false;
    }

    get field() {
        return SequelFieldDialog.data;
    }

    onOpen = () => {
        const {field} = this;
        console.log(field.spec.props_schema)
        this.propsSchema = {type: "object", properties: field.spec.props_schema};
        this.formData = {};
        this.name = field.getName();
    }

    close = () => {
        SequelFieldDialog.close();
    }

    reset = () => {
        this.propsSchema = {};
        this.formData = {};
        this.name = "";
    }

    render() {
        const header = <h5><Trans>Sequel Field</Trans></h5>;
        return (
            <Dialog
                className="SequelFieldDialog"
                isOpen={SequelFieldDialog.isOpen}
                onOpen={this.onOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" hideNextBtn={true}>
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