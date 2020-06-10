import "./config-field-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Field, fieldApi, LooseObject} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {Notifications} from "../notifications";
import {FRender} from "../ali-formrender";

interface Props extends Partial<DialogProps> {
}

function propsSchema(type: string) {
    switch (type) {
        case "string":
            return {
                type: "object",
                properties: {
                    required: [
                        "title"
                    ],
                    title: {
                        title: "title",
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
                    title: {
                        title: "title",
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
                    title: {
                        title: "title",
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

    @observable formData = {
        name: "default name",
        description: "default description",
    };
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
        const {field} = this;
        this.name = field.getName();
        this.field_type = field.spec.field_type;
        this.formData = JSON.parse(field.spec.form_data_config);
    }

    close = () => {
        ConfigFieldDialog.close();
    }

    reset = () => {
        this.formData = {
            name: "default name",
            description: "default description"
        };
        this.name = "";
    }

    adorn = (formData: any, type: string) => {
        let field: LooseObject = {};
        let props: LooseObject = {type: type};
        const formDataKeys = Object.keys(formData);

        for (let i = 0; i < formDataKeys.length; i++) {
            const fieldType = formDataKeys[i];

            if (fieldType == "select" && formData["select"] != []) {
                const enumArray: string[] = [];
                const enumNamesArray: string[] = [];
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
            await fieldApi.create({name, namespace}, this.field);
            this.close();
            this.reset();
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
                            onChange={(values: any) => { this.formData = values }}
                        />
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}