import "./taskrun.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { TaskRun, taskRunApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { taskRunStore } from "./taskrun.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { KubeEventIcon } from "../+events/kube-event-icon";
import { apiManager } from "../../api/api-manager";

enum sortBy {
    // name = "name",
    // namespace = "namespace",
    // pods = "pods",
    // age = "age",
}

interface Props extends RouteComponentProps {
}

@observer
export class TaskRuns extends React.Component<Props> {
    render() {
        return (
            <div className="ss">
                i coming
            </div>
            // <KubeObjectListLayout
            //     className="Pipelines" store={pipelineStore}
            //     dependentStores={[podsStore, nodesStore, eventStore]}  // other
            //     sortingCallbacks={{
            //         [sortBy.name]: (statefulSet: EnhanceStatefulSet) => statefulSet.getName(),
            //         [sortBy.namespace]: (statefulSet: EnhanceStatefulSet) => statefulSet.getNs(),
            //         [sortBy.age]: (statefulSet: EnhanceStatefulSet) => statefulSet.getAge(false),
            //         [sortBy.pods]: (statefulSet: EnhanceStatefulSet) => this.getPodsLength(statefulSet),
            //     }}
            //     searchFilters={[
            //         (statefulSet: EnhanceStatefulSet) => statefulSet.getSearchFields(),
            //     ]}
            //     renderHeaderTitle={<Trans>Stateful Sets</Trans>}
            //     renderTableHeader={[
            //         { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
            //         { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
            //         { title: <Trans>Pods</Trans>, className: "pods", sortBy: sortBy.pods },
            //         { className: "warning" },
            //         { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
            //     ]}
            //     renderTableContents={(statefulSet: EnhanceStatefulSet) => [
            //         statefulSet.getName(),
            //         statefulSet.getNs(),
            //         this.getPodsLength(statefulSet),
            //         <KubeEventIcon object={statefulSet} />,
            //         statefulSet.getAge(),
            //     ]}
            //     renderItemMenu={(item: EnhanceStatefulSet) => {
            //         return <EnhanceStatefulSetMenu object={item} />
            //     }}
            // />
        )
    }
}

export function TaskRunMenu(props: KubeObjectMenuProps<TaskRun>) {
    return (
        <KubeObjectMenu {...props} />
    )
}

apiManager.registerViews(taskRunApi, { Menu: TaskRunMenu, })
