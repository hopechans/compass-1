import React, { Fragment } from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { tektonStoreApi, TektonStore } from "../../api/endpoints";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { TooltipContent } from "../tooltip";
import { StatusBrick } from "../status-brick";
import { cssNames } from "../../utils";
import { tektonStore } from "./taskstore.store";

enum sortBy {
  name = "name",
  namespace = "namespace",
  ownernamespace = "ownernamespace",
  pods = "pods",
  age = "age",
}

interface Props extends RouteComponentProps {}

@observer
export class TektonStoreDetail extends React.Component<Props> {
  render() {
    return (
      <KubeObjectListLayout
        isClusterScoped
        className="TektonStores"
        store={tektonStore}
        sortingCallbacks={{
          [sortBy.name]: (tektonStore: TektonStore) => tektonStore.getName(),
          [sortBy.namespace]: (tektonStore: TektonStore) => tektonStore.getNs(),
          [sortBy.ownernamespace]: (tektonStore: TektonStore) =>
            tektonStore.getOwnerNamespace(),
          [sortBy.age]: (tektonStore: TektonStore) => tektonStore.getAge(false),
        }}
        searchFilters={[
          (tektonStore: TektonStore) => tektonStore.getSearchFields(),
        ]}
        renderHeaderTitle={<Trans>TektonStore</Trans>}
        renderTableHeader={[
          {
            title: <Trans>Name</Trans>,
            className: "name",
            sortBy: sortBy.name,
          },
          {
            title: <Trans>Namespace</Trans>,
            className: "namespace",
            sortBy: sortBy.namespace,
          },
          {
            title: <Trans>OwnerNamespace</Trans>,
            className: "ownernamespace",
            sortBy: sortBy.ownernamespace,
          },
          { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(tektonStore: TektonStore) => [
          tektonStore.getName(),
          tektonStore.getNs(),
          tektonStore.getOwnerNamespace(),
          tektonStore.getAge(),
        ]}
        renderItemMenu={(item: TektonStore) => {
          return <TaskRunMenu object={item} />;
        }}
      />
    );
  }
}

export function TaskRunMenu(props: KubeObjectMenuProps<TektonStore>) {
  return <KubeObjectMenu {...props} />;
}

apiManager.registerViews(tektonStoreApi, { Menu: TaskRunMenu });
