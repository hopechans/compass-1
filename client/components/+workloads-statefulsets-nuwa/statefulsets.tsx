import "./statefulsets.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { StatefulSetNuwa, statefulSetNuwaApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { statefulSetNuwaStore } from "./statefulset.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { IStatefulSetsNuwaRouteParams } from "../+workloads";
import { KubeEventIcon } from "../+events/kube-event-icon";
import { apiManager } from "../../api/api-manager";

enum sortBy {
  name = "name",
  namespace = "namespace",
  pods = "pods",
  age = "age",
}

interface Props extends RouteComponentProps<IStatefulSetsNuwaRouteParams> {
}

@observer
export class StatefulSetsNuwa extends React.Component<Props> {
  getPodsLength(statefulSet: StatefulSetNuwa) {
    return statefulSetNuwaStore.getChildPods(statefulSet).length;
  }

  render() {
    return (
      <KubeObjectListLayout
        className="StatefulSetsNuwa" store={statefulSetNuwaStore}
        dependentStores={[podsStore, nodesStore, eventStore]}
        sortingCallbacks={{
          [sortBy.name]: (statefulSet: StatefulSetNuwa) => statefulSet.getName(),
          [sortBy.namespace]: (statefulSet: StatefulSetNuwa) => statefulSet.getNs(),
          [sortBy.age]: (statefulSet: StatefulSetNuwa) => statefulSet.getAge(false),
          [sortBy.pods]: (statefulSet: StatefulSetNuwa) => this.getPodsLength(statefulSet),
        }}
        searchFilters={[
          (statefulSet: StatefulSetNuwa) => statefulSet.getSearchFields(),
        ]}
        renderHeaderTitle={<Trans>Stateful Sets</Trans>}
        renderTableHeader={[
          { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
          { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
          { title: <Trans>Pods</Trans>, className: "pods", sortBy: sortBy.pods },
          { className: "warning" },
          { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(statefulSet: StatefulSetNuwa) => [
          statefulSet.getName(),
          statefulSet.getNs(),
          this.getPodsLength(statefulSet),
          <KubeEventIcon object={statefulSet} />,
          statefulSet.getAge(),
        ]}
        renderItemMenu={(item: StatefulSetNuwa) => {
          return <StatefulSetNuwaMenu object={item} />
        }}
      />
    )
  }
}

export function StatefulSetNuwaMenu(props: KubeObjectMenuProps<StatefulSetNuwa>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(statefulSetNuwaApi, {
  Menu: StatefulSetNuwaMenu,
})
