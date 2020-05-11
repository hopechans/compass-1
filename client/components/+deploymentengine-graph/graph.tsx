import React from "react";
import {FRender} from "../ali-formrender";
import {FormRenderStore} from "../ali-formrender/ali-formrender.store";
import {autorun} from "mobx";


interface IGraphProps {
}

export class Graph extends React.Component<IGraphProps> {

    private namespace = "kube-system"
    private render_name = "example-formrender"
    private formRenderStore: any

    state = {formData: {}, valid: [] as string[]}

    constructor(props: IGraphProps) {
        super(props);

        autorun(() => {
            this.formRenderStore = new FormRenderStore(
                {namespace: this.namespace, render_name: this.render_name})
        })
    }

    setValid = (value: any) => {
        this.setState({valid: value})
    }

    setFormData = (value: any) => {
        console.log(value)
        this.setState({formData: value})
    }

    onSubmit = (valid: any, formData: any) => {
        if (valid.length > 0) {
            alert(`校验未通过字段：${valid.toString()}`);
        } else {
            alert(JSON.stringify(formData, null, 2));
        }
    }

    render() {
        return (
            <div style={{padding: 40}}>
                <FRender
                    propsSchema={this.formRenderStore.propsSchema}
                    uiSchema={this.formRenderStore.uiSchema}
                    formData={this.state.formData}
                    setFormData={this.setFormData}
                    valid={this.state.valid}
                />
                <button onClick={() => {this.onSubmit(this.state.valid, this.state.formData)}}>提交</button>
            </div>
        )
    }
}
