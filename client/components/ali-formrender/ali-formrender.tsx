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

    // state = {formData: this.props.formData, valid: this.props.valid}

    // constructor(props: Props) {
    //     super(props);
    //     this.setValid = this.setValid.bind(this)
    //     this.setFormData = this.setFormData.bind(this)
    // }

    // setValid = (value: any) => {
    //     this.setState({valid: value})
    // }
    //
    // setFormData = (value: any) => {
    //     this.setState({formData: value})
    // }

    render() {
        return (
            <FormRender
                propsSchema={this.props.propsSchema}
                uiSchema={this.props.uiSchema}
                formData={this.props.formData}
                onChange={this.props.setFormData}
                onValidate={this.props.setValid}
                // formData={this.state.formData}
                // onChange={this.setFormData}
                // onValidate={this.setValid}
            />
        )
    }

}