import React from "react";
import FormRender from "form-render/lib/antd";
import {Button} from "../button";


interface Props {
    propsSchema: {},
    uiSchema: {},
    formData: {},
    setFormData: any,
    valid?: any,
    setValid?: any,
    onSubmit?: any,
}


export class FRender extends React.Component<Props> {

    render() {
        return (
            <div style={{padding: 40}}>
                <FormRender
                    propsSchema={this.props.propsSchema}
                    uiSchema={this.props.uiSchema}
                    formData={this.props.formData}
                    onChange={this.props.setFormData}
                    onValidate={this.props.setValid}
                />
                <Button onClick={this.props.onSubmit}>submit</Button>
            </div>
        )
    }

}
