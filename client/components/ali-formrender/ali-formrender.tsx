import React from "react";
import FormRender from "form-render/lib/antd";


interface Props {
    propsSchema: {},
    uiSchema: {},
    setFormData?: void,
    setValid?: void,
}


export class FRender extends React.Component<Props> {

    state = {formData: {}, valid: [] as string[]}

    setValid = (value: any) => {
        this.setState({valid: value})
    }

    setFormData = (value: any) => {
        this.setState({formData: value})
    }

    render() {
        // const {formData, valid} = this.state;
        return (
            <FormRender
                propsSchema={this.props.propsSchema}
                uiSchema={this.props.uiSchema}
                formData={this.state.formData}
                onChange={this.setFormData}
                onValidate={this.setValid}
            />
        );
    }

}