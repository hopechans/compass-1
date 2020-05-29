import "./pipeline.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Pipeline, pipelineApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { pipelineStore } from "./pipeline.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { KubeEventIcon } from "../+events/kube-event-icon";
import { apiManager } from "../../api/api-manager";

enum sortBy {
    name = "name",
    namespace = "namespace",
    tasks = "tasks",
    tasknames = "tasknames",
    age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class Pipelines extends React.Component<Props> {
    render() {
        return (
            <KubeObjectListLayout
                className="Pipelines" store={pipelineStore}
                dependentStores={[podsStore, nodesStore, eventStore]}  // other
                sortingCallbacks={{
                    [sortBy.name]: (pipeline: Pipeline) => pipeline.getName(),
                    [sortBy.namespace]: (pipeline: Pipeline) => pipeline.getNs(),
                    [sortBy.age]: (pipeline: Pipeline) => pipeline.getAge(false),
                    [sortBy.tasks]: (pipeline: Pipeline) => pipeline.getTasks().length,
                }}
                searchFilters={[
                    (pipeline: Pipeline) => pipeline.getSearchFields(),
                ]}
                renderHeaderTitle={<Trans>Tekton Pipeline</Trans>}
                renderTableHeader={[
                    { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
                    { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
                    { title: <Trans>Tasks</Trans>, className: "tasks", sortBy: sortBy.tasks },
                    { title: <Trans>TaskNames</Trans>, className: "tasknames", sortBy: sortBy.tasknames },
                    { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
                ]}
                renderTableContents={(pipeline: Pipeline) => [
                    pipeline.getName(),
                    pipeline.getNs(),
                    pipeline.getTasks().length,
                    pipeline.getTaskSet().map(
                        task => <p key={task}>{task}</p>
                    ),
                    pipeline.getAge(),
                ]}
                renderItemMenu={(item: Pipeline) => {
                    return <PipelineMenu object={item} />
                }}
                tableProps={{
                    customRowHeights: (item: Pipeline, lineHeight, paddings) => {
                        const lines = item.getTaskSet().length || 1;
                        return lines * lineHeight + paddings;
                    }
                }}
            />
        )
    }
}

export function PipelineMenu(props: KubeObjectMenuProps<Pipeline>) {
    return (
        <KubeObjectMenu {...props} />
    )
}

apiManager.registerViews(pipelineApi, { Menu: PipelineMenu, })
