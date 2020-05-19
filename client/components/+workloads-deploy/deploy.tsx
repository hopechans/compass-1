import "./deploy.store.ts";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Deploy, deployApi } from "../../api/endpoints";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { IDeployRouteParams } from "../+workloads";
import { apiManager } from "../../api/api-manager";
import { deployStore } from "./deploy.store";

enum sortBy {
  name = "name",
  namespace = "namespace",
  generateTimestamp = "generateTimestamp",
  age = "age",
}

interface Props extends RouteComponentProps<IDeployRouteParams> {
}

@observer
export class Deploys extends React.Component<Props> {

  render() {
    return (
      <KubeObjectListLayout
        className="Deploys" store={deployStore}
        sortingCallbacks={{
          [sortBy.name]: (deploy: Deploy) => deploy.getName(),
          [sortBy.namespace]: (deploy: Deploy) => deploy.getNs(),
          [sortBy.age]: (deploy: Deploy) => deploy.getAge(false),
        }
        }

        searchFilters={
          [
            (deploy: Deploy) => deploy.getSearchFields(),
          ]}

        renderHeaderTitle={< Trans > Deploys </Trans >}
        renderTableHeader={
          [
            { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
            { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
            { title: <Trans>GenerateTimestamp</Trans>, className: "generateTimestamp", sortBy: sortBy.generateTimestamp },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}

        renderTableContents={(deploy: Deploy) => [
          deploy.getName(),
          deploy.getNs(),
          new Date(deploy.getGenerateTimestamp()  * 1e3).toISOString(),
          deploy.getAge(),
        ]}

        renderItemMenu={(item: Deploy) => {
          return <DeployMenu object={item} />
        }}
      />
    )
  }
}

export function DeployMenu(props: KubeObjectMenuProps<Deploy>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(deployApi, {
  Menu: DeployMenu,
})
