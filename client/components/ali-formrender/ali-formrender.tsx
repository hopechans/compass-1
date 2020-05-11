import React from "react";
import FormRender from "form-render/lib/antd";


interface Props {
    propsSchema: {},
    uiSchema: {},
    formData: {},
    setFormData: any,
    valid?: any,
    setValid?: any,
}


export class FRender extends React.Component<Props> {

    render() {
        return (
            <FormRender
                propsSchema={this.props.propsSchema}
                uiSchema={this.props.uiSchema}
                formData={this.props.formData}
                onChange={this.props.setFormData}
                onValidate={this.props.setValid}
            />
        )
    }

}