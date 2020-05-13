import React from "react";
import {FRender} from "../ali-formrender";
import {FormRenderStore} from "../ali-formrender/ali-formrender.store";
import {autorun} from "mobx";


interface IGraphProps {
}

export class Graph extends React.Component<IGraphProps> {

    // private namespace = "kube-system"
    // private render_name = "example-formrender"
    // private formRenderStore: any

    state = {formData: {}, valid: [] as string[]}

    constructor(props: IGraphProps) {
        super(props);

        // autorun(() => {
        //     this.formRenderStore = new FormRenderStore(
        //         {namespace: this.namespace, render_name: this.render_name})
        // })
    }

    include(l:any, a:any) {
        return !l.include(a)
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
                        // title
                        title: {
                            title: "名称(title)",
                            type: "string",
                            "ui:width": "50%",
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
                        // required
                        required: {
                            title: "设置为必填项(required)",
                            type: "boolean",
                            "ui:widget": "switch",
                        },
                        type: {
                            title: "类型(type)",
                            type: "string",
                            enum: [
                                "string",
                                "boolean",
                                "select",
                                "number",
                                "range",
                                "array",
                            ],
                            enumNames: [
                                "字符串(string)",
                                "布尔值(boolean)",
                                "选择框(select)",
                                "数字(number)",
                                "范围(range)",
                                "数组多选(array)",
                            ],
                        },
                        // string
                        pattern: {
                            title: "正则匹配(pattern)",
                            type: "string",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.type != 'string'}}"
                        },
                        format: {
                            title: "组件格式(format)",
                            type: "string",
                            "ui:width": "50%",
                            enum: [
                                "",
                                "time",
                                "date",
                                "dateTime",
                            ],
                            enumNames: [
                                "",
                                "time",
                                "date",
                                "dateTime",
                            ],
                            "ui:hidden": "{{ !['string', 'array'].includes(rootValue.type) }}"
                        },
                        default: {
                            title: "默认值(default)",
                            type: "string",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.type != 'string'}}"
                        },
                        minLength: {
                            title: "最小长度(minLength)",
                            type: "number",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.type !== 'string' }}"
                        },
                        maxLength: {
                            title: "最大长度(maxLength)",
                            type: "number",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.type !== 'string' }}"
                        },
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
                            "ui:hidden": "{{ !['select', 'array'].includes(rootValue.type) }}"
                        },
                        // number
                        // uiConfig
                        uiConfig: {
                            title: "ui样式(uiConfig)",
                            type: "boolean",
                            "ui:widget": "switch"
                        },
                        "ui:className": {
                            title: "ui类名(ui:className)",
                            type: "string",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.uiConfig === false}}"
                        },
                        "ui:width": {
                            title: "ui宽度(ui:width)",
                            type: "number",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.uiConfig === false}}"
                        },
                        "ui:widget": {
                            title: "ui插件(ui:widget)",
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
                            ],
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.uiConfig === false }}"
                        },
                        // ui:options
                        uiOptions: {
                            title: "ui配置(uiOptions)",
                            type: "boolean",
                            "ui:widget": "switch"
                        },
                        "prefix": {
                            title: "前缀(prefix)",
                            type: "string",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.uiOptions === false }}"
                        },
                        "suffix": {
                            title: "后缀(suffix)",
                            type: "string",
                            "ui:width": "50%",
                            "ui:hidden": "{{ rootValue.uiOptions === false }}"
                        },
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

    onSubmit = () => {
        if (this.state.valid.length > 0) {
            alert(`校验未通过字段：${this.state.valid.toString()}`);
        } else {
            const thisFormData = JSON.stringify(this.state.formData, null, 2)
            alert(thisFormData);
            console.log(thisFormData)

        }
    }

    render() {
        const bgStyle={
            backgroundColor:'#fff'
        }
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
