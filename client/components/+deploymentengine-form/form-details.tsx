import "./form-details.scss"

import React from "react";
import {observer} from "mobx-react";
import {KubeObjectDetailsProps} from "../kube-object";
import {KubeEventDetails} from "../+events/kube-event-details";
import {apiManager} from "../../api/api-manager";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {formApi, Form} from "../../api/endpoints";

interface Props extends KubeObjectDetailsProps<Form> {
}

@observer
export class FormDetails extends React.Component<Props> {

    render() {
        const {object: form} = this.props;
        if (!form) return;
        return (
            <div className="FormDetails">
                <KubeObjectMeta object={form}/>
                <KubeEventDetails object={form}/>
            </div>
        );
    }
}

apiManager.registerViews(formApi, {
    Details: FormDetails,
});
