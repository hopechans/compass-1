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
import {formApi, Form} from "../../api/endpoints/form.api";

interface Props extends KubeObjectDetailsProps<Form> {
}

@observer
export class FormDetails extends React.Component<Props> {

    render() {
        const {object: form} = this.props;
        if (!form) return;
        const {scaleTargetRef} = form.spec;
        return (
            <div className="FormDetails">
                <KubeObjectMeta object={form}/>

                <DrawerItem name={<Trans>Reference</Trans>}>
                    {scaleTargetRef && (
                        <Link to={getDetailsUrl(lookupApiLink(scaleTargetRef, form))}>
                            {scaleTargetRef.kind}/{scaleTargetRef.name}
                        </Link>
                    )}
                </DrawerItem>

                <KubeEventDetails object={form}/>
            </div>
        );
    }
}

apiManager.registerViews(formApi, {
    Details: FormDetails,
});
