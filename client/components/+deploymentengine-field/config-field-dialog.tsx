import "./config-field-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Field, fieldApi} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {Notifications} from "../notifications";
import {showDetails} from "../../navigation";
import {FRender} from "../ali-formrender";

interface LooseObject {
    [key: string]: any
}

interface Props extends Partial<DialogProps> {
}

function propsSchema(type: string) {
    switch (type) {
        case "string":
            return {
                type: "object",
                properties: {
                    required: [
                        "name"
                    ],
                    name: {
                        title: "name",
                        type: "string",
                    },
                    pattern: {
                        title: "pattern",
                        type: "string",
                    },
                    description: {
                        title: "description",
                        type: "string",
                    },
                    select: {
                        title: "select",
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                key: {
                                    title: "key",
                                    type: "string"
                                },
                                value: {
                                    title: "value",
                                    type: "string"
                                }
                            }
                        }
                    },
                    "ui:widget": {
                        title: "ui:widget",
                        type: "string",
                        enum: [
                            "",
                            "color",
                            "radio",
                            "upload",
                            "textarea",
                            "date",
                        ],
                        enumNames: [
                            "",
                            "color",
                            "radio",
                            "upload",
                            "textarea",
                            "date",
                        ]
                    },
                    "prefix": {
                        title: "prefix",
                        type: "string",
                    },
                    "suffix": {
                        title: "suffix",
                        type: "string",
                    },
                }
            }
        case "number":
            return {
                type: "object",
                properties: {
                    name: {
                        title: "name",
                        type: "string",
                        required: true
                    },
                    description: {
                        title: "description",
                        type: "string",
                    },
                    pattern: {
                        title: "pattern",
                        type: "string",
                    },
                    min: {
                        title: "min",
                        type: "number",
                    },
                    max: {
                        title: "max",
                        type: "number",
                    },
                    "prefix": {
                        title: "prefix",
                        type: "string",
                    },
                    "suffix": {
                        title: "suffix",
                        type: "string",
                    },
                }
            }
        case "boolean":
            return {
                type: "object",
                properties: {
                    name: {
                        title: "name",
                        type: "string",
                        required: true
                    },
                    description: {
                        title: "description",
                        type: "string",
                    },
                    default: {
                        title: "default",
                        type: "boolean",
                    },
                    "ui:widget": {
                        title: "ui:widget",
                        type: "string",
                        enum: [
                            "",
                            "color",
                            "radio",
                            "upload",
                            "textarea",
                            "date",
                        ],
                        enumNames: [
                            "",
                            "color",
                            "radio",
                            "upload",
                            "textarea",
                            "date",
                        ]
                    },
                }
            }

    }
}


@observer
export class ConfigFieldDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static data: Field = null;

    @observable formData = {};
    @observable name = "";
    @observable field_type = "";
    @observable namespace = "kube-system";

    static open(field: Field) {
        ConfigFieldDialog.isOpen = true;
        ConfigFieldDialog.data = field;
    }

    static close() {
        ConfigFieldDialog.isOpen = false;
    }

    get field() {
        return ConfigFieldDialog.data;
    }

    onOpen = () => {
        const { field } = this;
        this.formData = JSON.parse(field.spec.form_data_config);
        this.name = field.getName();
        this.field_type = field.spec.field_type;
    }

    close = () => {
        ConfigFieldDialog.close();
    }

    reset = () => {
        this.formData = {};
        this.name = "";
    }

    adorn = (formData: any, type: string) => {
        const field: LooseObject = {};
        const props: LooseObject = {type: type};
        const propsKeys = Object.keys(formData);

        for (let i = 0; i < propsKeys.length; i++) {

            const fieldType = propsKeys[i];
            if (fieldType == "select" && formData[fieldType] != "") {

                const enumArray = [];
                const enumNamesArray = [];
                // Enum EnumNames
                for (let i = 0; i < formData[fieldType].length; i++) {
                    enumArray.push(formData[fieldType][i]["key"]);
                    enumNamesArray.push(formData[fieldType][i]["value"]);
                }
                props["enum"] = enumArray;
                props["enumNames"] = enumNamesArray;

            } else if (formData[fieldType] != "") {
                props[fieldType] = formData[fieldType];
            }
        }

        field[this.field.getName()] = props;
        return field
    }

    updateField = async () => {
        const {namespace} = this;
        this.field.spec.form_data_config = JSON.stringify(this.formData)
        this.field.spec.props_schema = JSON.stringify(this.adorn(this.formData, this.field.spec.field_type))
        try {
            const newField = await fieldApi.create({name, namespace}, this.field);
            showDetails(newField.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const header = <h5><Trans>Update Field</Trans></h5>;
        return (
            <Dialog
                className="ConfigFieldDialog"
                isOpen={ConfigFieldDialog.isOpen}
                onOpen={this.onOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Update</Trans>} next={this.updateField}>
                        <FRender
                            propsSchema={propsSchema(this.field_type)}
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