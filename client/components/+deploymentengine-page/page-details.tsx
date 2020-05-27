import "./page-details.scss"

import React from "react";
import {observer} from "mobx-react";
import {KubeObjectDetailsProps} from "../kube-object";
import {KubeEventDetails} from "../+events/kube-event-details";
import {apiManager} from "../../api/api-manager";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {pageApi, Page} from "../../api/endpoints";

interface Props extends KubeObjectDetailsProps<Page> {
}

@observer
export class PageDetails extends React.Component<Props> {

    render() {
        const {object: page} = this.props;
        if (!page) return;
        return (
            <div className="PageDetails">
                <KubeObjectMeta object={page}/>
                <KubeEventDetails object={page}/>
            </div>
        );
    }
}

apiManager.registerViews(pageApi, {
    Details: PageDetails,
});
