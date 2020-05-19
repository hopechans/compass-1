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
import {pageApi, Page} from "../../api/endpoints/page.api";

interface Props extends KubeObjectDetailsProps<Page> {
}

@observer
export class PageDetails extends React.Component<Props> {

    render() {
        const {object: page} = this.props;
        if (!page) return;
        const {scaleTargetRef} = page.spec;
        return (
            <div className="PageDetails">
                <KubeObjectMeta object={page}/>

                <DrawerItem name={<Trans>Reference</Trans>}>
                    {scaleTargetRef && (
                        <Link to={getDetailsUrl(lookupApiLink(scaleTargetRef, page))}>
                            {scaleTargetRef.kind}/{scaleTargetRef.name}
                        </Link>
                    )}
                </DrawerItem>

                <KubeEventDetails object={page}/>
            </div>
        );
    }
}

apiManager.registerViews(pageApi, {
    Details: PageDetails,
});
