import "./stones.store.ts";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Stone, stoneApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { stoneStore } from "./stones.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { IStatefulSetsRouteParams } from "../+workloads";
import { KubeEventIcon } from "../+events/kube-event-icon";
import { apiManager } from "../../api/api-manager";

enum sortBy {
  name = "name",
  namespace = "namespace",
  pods = "pods",
  sts = "sts",
  age = "age",

}

interface Props extends RouteComponentProps<IStatefulSetsRouteParams> {
}

@observer
export class Stones extends React.Component<Props> {
  getPodsLength(stone: Stone) {
    return stoneStore.getChildPods(stone).length;
  }

  getEnhanceStatefulSetLength(stone: Stone) {
    return stoneStore.getChildEnhanceStatefulset(stone).length
  }


  render() {
    return (
      <KubeObjectListLayout
        className="Stones" store={stoneStore}
        dependentStores={[podsStore, nodesStore, eventStore]}
        sortingCallbacks={{
          [sortBy.name]: (stone: Stone) => stone.getName(),
          [sortBy.namespace]: (stone: Stone) => stone.getNs(),
          [sortBy.age]: (stone: Stone) => stone.getAge(false),
          [sortBy.sts]: (stone: Stone) => this.getEnhanceStatefulSetLength(stone),
          [sortBy.pods]: (stone: Stone) => this.getPodsLength(stone),
        }}
        searchFilters={[
          (stone: Stone) => stone.getSearchFields(),
        ]}
        renderHeaderTitle={<Trans>Stateful Sets</Trans>}
        renderTableHeader={[
          { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
          { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
          { title: <Trans>Pods</Trans>, className: "pods", sortBy: sortBy.pods },
          { title: <Trans>Sts</Trans>, className: "sts", sortBy: sortBy.sts },
          { className: "warning" },
          { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(stone: Stone) => [
          stone.getName(),
          stone.getNs(),
          this.getPodsLength(stone),
          <KubeEventIcon object={stone} />,
          stone.getAge(),
        ]}
        renderItemMenu={(item: Stone) => {
          return <StoneMenu object={item} />
        }}
      />
    )
  }
}

export function StoneMenu(props: KubeObjectMenuProps<Stone>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(stoneApi, {
  Menu: StoneMenu,
})
