import React from "react";
import FormRender from "form-render/lib/antd";
import {Button} from "../button";


interface Props {
    propsSchema: {},
    uiSchema?: {},
    formData: {},
    onChange?: any,
    valid?: any,
    setValid?: any,
}


export class FRender extends React.Component<Props> {

    render() {
        return (
            <div style={{padding: 40}}>
                <FormRender
                    propsSchema={this.props.propsSchema}
                    uiSchema={this.props.uiSchema}
                    formData={this.props.formData}
                    onChange={this.props.onChange}
                    onValidate={this.props.setValid}
                />
            </div>
        )
    }

}
