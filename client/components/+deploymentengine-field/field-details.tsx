import "./field-details.scss";

import React from "react";
import {observer} from "mobx-react";
import {KubeObjectDetailsProps} from "../kube-object";
import {KubeEventDetails} from "../+events/kube-event-details";
import {apiManager} from "../../api/api-manager";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {fieldApi, Field} from "../../api/endpoints";

interface Props extends KubeObjectDetailsProps<Field> {
}

@observer
export class FieldDetails extends React.Component<Props> {

    render() {
        const {object: field} = this.props;
        if (!field) return;
        return (
            <>
                <div className="FieldDetails">
                    <KubeObjectMeta object={field}/>
                    <KubeEventDetails object={field}/>
                </div>
            </>
        );
    }
}

apiManager.registerViews(fieldApi, {
    Details: FieldDetails,
});
