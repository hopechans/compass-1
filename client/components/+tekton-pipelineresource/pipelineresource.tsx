import "./pipelineresource.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { PipelineResource, pipelineResourceApi } from "../../api/endpoints";
import { pipelineResourceStore } from "./pipelineresource.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";

enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class PipelineResources extends React.Component<Props> {
    render() {
        return (
            <KubeObjectListLayout
                className="PipelineResources" store={pipelineResourceStore}
                sortingCallbacks={{
                    [sortBy.name]: (pipelineResource: PipelineResource) => pipelineResource.getName(),
                    [sortBy.namespace]: (pipelineResource: PipelineResource) => pipelineResource.getNs(),
                    [sortBy.age]: (pipelineResource: PipelineResource) => pipelineResource.getAge(false),
                    // [sortBy.pods]: (pipelineResource:PipelineResource) => this.getPodsLength(statefulSet),
                }}
                searchFilters={[
                    (pipelineResource: PipelineResource) => pipelineResource.getSearchFields(),
                ]}
                renderHeaderTitle={<Trans>Stateful Sets</Trans>}
                renderTableHeader={[
                    { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
                    { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
                    // { title: <Trans>Pods</Trans>, className: "pods", sortBy: sortBy.pods },
                    // { className: "warning" },
                    { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
                ]}
                renderTableContents={(pipelineResource: PipelineResource) => [
                    pipelineResource.getName(),
                    pipelineResource.getNs(),
                    // this.getPodsLength(statefulSet),
                    // <KubeEventIcon object={pipelineResource} />,
                    pipelineResource.getAge(),
                ]}
                renderItemMenu={(item: PipelineResource) => {
                    return <PipelineResourceMenu object={item} />
                }}
            />
        )
    }
}

export function PipelineResourceMenu(props: KubeObjectMenuProps<PipelineResource>) {
    return (
        <KubeObjectMenu {...props} />
    )
}

apiManager.registerViews(pipelineResourceApi, { Menu: PipelineResourceMenu, })
