import React from "react";
import {FRender} from "../ali-formrender";
import {FormRenderStore} from "../ali-formrender/ali-formrender.store";
import {autorun, keys} from "mobx";

interface LooseObject {
    [key: string] : any
}

interface IGraphProps {
}

export class Graph extends React.Component<IGraphProps> {

    // private namespace = "kube-system"
    // private render_name = "example-formrender"
    // private formRenderStore: any

    state = {formData: {}, valid: [] as string[]}
    nestedList: any;
    keyWordMap: any;

    constructor(props: IGraphProps) {
        super(props);
        this.nestedList = [];
        this.keyWordMap = {
            "string": ["title", "required", "description", "message", "type",
                "pattern"],
            "select": ["title", "required", "description", "message", "type",
                "select"],
            "array": ["title", "required", "description", "message", "type",
                "array"],
            "number": ["title", "required", "description", "message", "type"],
            "boolean": ["title", "required", "description", "message", "type"],
        };

        // autorun(() => {
        //     this.formRenderStore = new FormRenderStore(
        //         {namespace: this.namespace, render_name: this.render_name})
        // })
    }

    setNestedList(formData: any) {
        this.nestedList = [];
        if (formData.hasOwnProperty("properties")) {
            for (let i = 0; i < formData.properties.length; i++) {
                if (formData.properties[i].nested && formData.properties[i].id != "") {
                    this.nestedList.push(formData.properties[i].id);
                }
            }
        }
    }

    propsSchema = {
        type: "object",
        properties: {
            properties: {
                title: "模版(Template)",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        // id
                        id: {
                            title: "选项id",
                            type: "string",
                            "ui:width": "50%",
                        },
                        // title
                        title: {
                            title: "名称(title)",
                            type: "string",
                            "ui:width": "50%",
                        },
                        // nested
                        nested: {
                            title: "设置为嵌套模版(nested)",
                            type: "boolean",
                            "ui:width": "50%",
                            "ui:widget": "switch",
                        },
                        // required
                        required: {
                            title: "设置为必填项(required)",
                            type: "boolean",
                            "ui:width": "50%",
                            "ui:widget": "switch",
                        },
                        // description
                        description: {
                            title: "描述(description)",
                            type: "string",
                            "ui:width": "50%",
                        },
                        // message
                        message: {
                            title: "提示(message)",
                            type: "string",
                            "ui:width": "50%",
                        },
                        type: {
                            title: "类型(type)",
                            type: "string",
                            enum: [
                                "string",
                                "boolean",
                                "select",
                                "number",
                                "array",
                            ],
                            enumNames: [
                                "字符串(string)",
                                "布尔值(boolean)",
                                "选择框(select)",
                                "数字(number)",
                                "嵌套(array)",
                            ],
                        },
                        // string
                        pattern: {
                            title: "正则匹配(pattern)",
                            type: "string",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.type != 'string'}}"
                        },
                        // format: {
                        //     title: "组件格式(format)",
                        //     type: "string",
                        //     "ui:width": "50%",
                        //     enum: [
                        //         "",
                        //         "time",
                        //         "date",
                        //         "dateTime",
                        //     ],
                        //     enumNames: [
                        //         "",
                        //         "time",
                        //         "date",
                        //         "dateTime",
                        //     ],
                        //     "ui:hidden": "{{ !['string'].includes(rootValue.type) }}"
                        // },
                        default: {
                            title: "默认值(default)",
                            type: "string",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.type != 'string'}}"
                        },
                        // minLength: {
                        //     title: "最小长度(minLength)",
                        //     type: "number",
                        //     "ui:width": "50%",
                        //     "ui:hidden": "{{ rootValue.type !== 'string' }}"
                        // },
                        // maxLength: {
                        //     title: "最大长度(maxLength)",
                        //     type: "number",
                        //     "ui:width": "50%",
                        //     "ui:hidden": "{{ rootValue.type !== 'string' }}"
                        // },
                        // select
                        select: {
                            title: "键值对(select)",
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
                            },
                            "ui:hidden": "{{ !['select'].includes(rootValue.type) }}"
                        },
                        // number
                        // nested
                        array: {
                            title: "嵌套模版id(array)",
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    template: {
                                        title: "-",
                                        type: "string",
                                        enum: () => {
                                            return this.nestedList
                                        },
                                        enumNames: () => {
                                            return this.nestedList
                                        }
                                    }
                                }
                            },
                            "ui:hidden": "{{ !['array'].includes(rootValue.type) }}"
                        },
                        // // uiConfig
                        // uiConfig: {
                        //     title: "ui样式(uiConfig)",
                        //     type: "boolean",
                        //     "ui:widget": "switch"
                        // },
                        // "ui:className": {
                        //     title: "ui类名(ui:className)",
                        //     type: "string",
                        //     "ui:width": "50%",
                        //     "ui:hidden": "{{ rootValue.uiConfig === false}}"
                        // },
                        // "ui:width": {
                        //     title: "ui宽度(ui:width)",
                        //     type: "number",
                        //     "ui:width": "50%",
                        //     "ui:hidden": "{{ rootValue.uiConfig === false}}"
                        // },
                        // "ui:widget": {
                        //     title: "ui插件(ui:widget)",
                        //     type: "string",
                        //     enum: [
                        //         "",
                        //         "color",
                        //         "radio",
                        //         "upload",
                        //         "textarea",
                        //         "date",
                        //     ],
                        //     enumNames: [
                        //         "",
                        //         "color",
                        //         "radio",
                        //         "upload",
                        //         "textarea",
                        //         "date",
                        //     ],
                        //     "ui:width": "50%",
                        //     "ui:hidden": "{{ rootValue.uiConfig === false }}"
                        // },
                        // // ui:options
                        // uiOptions: {
                        //     title: "ui配置(uiOptions)",
                        //     type: "boolean",
                        //     "ui:widget": "switch"
                        // },
                        // "prefix": {
                        //     title: "前缀(prefix)",
                        //     type: "string",
                        //     "ui:width": "50%",
                        //     "ui:hidden": "{{ rootValue.uiOptions === false }}"
                        // },
                        // "suffix": {
                        //     title: "后缀(suffix)",
                        //     type: "string",
                        //     "ui:width": "50%",
                        //     "ui:hidden": "{{ rootValue.uiOptions === false }}"
                        // },
                    }
                },
                "ui:options": {
                    "foldable": true,
                }
            },

        },
    };
    uiSchema = {};

    setValid = (value: any) => {
        this.setState({valid: value})
    }

    setFormData = (value: any) => {
        this.setState({formData: value})
    }

    adorn(formData: any) {
        if (formData.hasOwnProperty("properties")) {
            const properties: LooseObject = {};

            for (let i = 0; i < formData.properties.length; i++) {

                const props = formData.properties[i];
                const propsId = props.id;
                const propsType = props.type;
                const propsKeys = Object.keys(props);
                const args: LooseObject = {};

                // without nested
                for (let i=0; i < propsKeys.length; i++) {
                    const key = propsKeys[i]
                    if (this.keyWordMap[propsType].includes(key) && props[key] != "") {

                        if (propsType == "select" && key == "select") {
                            const enumArray = [];
                            const enumNamesArray = [];
                            // Enum EnumNames
                            for (let i=0; i < props[key].length; i++) {
                                enumArray.push(props[key][i]["key"])
                                enumNamesArray.push(props[key][i]["value"])
                            }
                            args["enum"] = enumArray;
                            args["enumNames"] = enumNamesArray;
                        }
                        else{
                            args[key] = props[key]
                        }
                    }
                }
                // with nested


                // set properties
                properties[propsId] = args;

            }
            return {type: "object", properties: properties}
        }
    }

    onSubmit = () => {
        if (this.state.valid.length > 0) {
            alert(`校验未通过字段：${this.state.valid.toString()}`);
        } else {
            console.log(this.adorn(this.state.formData))
            const thisFormData = JSON.stringify(this.state.formData, null, 2)
            alert(thisFormData);
            console.log(thisFormData)
        }
    }

    render() {
        const bgStyle = {
            backgroundColor: '#fff'
        }
        this.setNestedList(this.state.formData)
        return (
            <div style={bgStyle}>
                <FRender
                    // propsSchema={this.formRenderStore.propsSchema}
                    // uiSchema={this.formRenderStore.uiSchema}
                    propsSchema={this.propsSchema}
                    uiSchema={this.uiSchema}
                    formData={this.state.formData}
                    setFormData={this.setFormData}
                    setValid={this.setValid}
                    onSubmit={this.onSubmit}
                />
            </div>
        )
    }
}
