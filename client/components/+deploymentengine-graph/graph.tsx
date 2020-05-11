import React from "react";
import {FRender} from "../ali-formrender";
import {formRenderStore} from "../ali-formrender/ali-formrender.store";


interface IGraphProps {
}

export class Graph extends React.Component<IGraphProps> {

    private propsSchema = formRenderStore.propsSchema;
    private uiSchema = formRenderStore.uiSchema;

    // setValid = (value: any) => {
    //     this.setState({valid: value})
    // }
    //
    // setFormData = (value: any) => {
    //     this.setState({formData: value})
    // }

    onSubmit = () => {
        // if (valid.length > 0) {
        //     alert(`校验未通过字段：${valid.toString()}`);
        // } else {
        //     alert(JSON.stringify(formData, null, 2));
        // }
    }

    render() {
        return (
            <div style={{padding: 40}}>
                <FRender propsSchema={this.propsSchema} uiSchema={this.uiSchema} />
                <button onClick={this.onSubmit}>提交</button>
            </div>
        )
    }
}
