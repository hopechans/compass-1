import React from "react";
import {observer} from "mobx-react";
import {Link} from "react-router-dom";
import {DrawerItem} from "../drawer";
import {KubeObjectDetailsProps} from "../kube-object";
import {KubeEventDetails} from "../+events/kube-event-details";
import {Trans} from "@lingui/macro";
import {getDetailsUrl} from "../../navigation";
import {lookupApiLink} from "../../api/kube-api";
import {apiManager} from "../../api/api-manager";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {fieldApi, Field} from "../../api/endpoints/field.api";

interface Props extends KubeObjectDetailsProps<Field> {
}

@observer
export class FieldDetails extends React.Component<Props> {

    render() {
        const {object: field} = this.props;
        if (!field) return;
        const {scaleTargetRef} = field.spec;
        return (
            <div className="FieldDetails">
                <KubeObjectMeta object={field}/>

                <DrawerItem name={<Trans>Reference</Trans>}>
                    {scaleTargetRef && (
                        <Link to={getDetailsUrl(lookupApiLink(scaleTargetRef, field))}>
                            {scaleTargetRef.kind}/{scaleTargetRef.name}
                        </Link>
                    )}
                </DrawerItem>

                <KubeEventDetails object={field}/>
            </div>
        );
    }
}

apiManager.registerViews(fieldApi, {
    Details: FieldDetails,
});
