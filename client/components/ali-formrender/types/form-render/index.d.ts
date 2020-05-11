declare module "form-render/lib/antd" {
    import React from "react";
    export interface FRProps {
        propsSchema: object;
        formData: object;
        onChange(data?: object): void;
        name?: string;
        column?: number;
        uiSchema?: object;
        widgets?: any;
        FieldUI?: any;
        fields?: any;
        mapping?: object;
        showDescIcon?: boolean;
        showValidate?: boolean;
        displayType?: string;
        onValidate: any;
        readOnly?: boolean;
        labelWidth?: number | string;
    }
    class FormRender extends React.Component<FRProps> {}
    export default FormRender;
}