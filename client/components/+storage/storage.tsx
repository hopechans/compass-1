import "./storage.scss"

import * as React from "react";
import { observer } from "mobx-react";
import { Redirect, Route, Switch } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { PersistentVolumes, volumesRoute, volumesURL } from "../+storage-volumes";
import { StorageClasses, storageClassesRoute, storageClassesURL } from "../+storage-classes";
import { PersistentVolumeClaims, volumeClaimsRoute, volumeClaimsURL } from "../+storage-volume-claims";
import { namespaceStore } from "../+namespaces/namespace.store";
import { storageURL } from "./storage.route";
import { configStore } from "../../../client/config.store";

interface Props extends RouteComponentProps<{}> {
}

@observer
export class Storage extends React.Component<Props> {
  static get tabRoutes() {
    const tabRoutes: TabRoute[] = [];
    const query = namespaceStore.getContextParams()
    const userConifg = JSON.parse(localStorage.getItem('u_config'))
    const isClusterAdmin = userConifg ? userConifg.isClusterAdmin : false
    tabRoutes.push({
      title: <Trans>Persistent Volume Claims</Trans>,
      component: PersistentVolumeClaims,
      url: volumeClaimsURL({ query }),
      path: volumeClaimsRoute.path,
    })

    if (true) {
      tabRoutes.push({
        title: <Trans>Persistent Volumes</Trans>,
        component: PersistentVolumes,
        url: volumesURL(),
        path: volumesRoute.path,
      });
    }

    if (isClusterAdmin) {
      tabRoutes.push({
        title: <Trans>Storage Classes</Trans>,
        component: StorageClasses,
        url: storageClassesURL(),
        path: storageClassesRoute.path,
      })
    }
    return tabRoutes;
  }

  render() {
    const tabRoutes = Storage.tabRoutes;
    return (
      <MainLayout className="Storage" tabs={tabRoutes}>
        <Switch>
          {tabRoutes.map((route, index) => <Route key={index} {...route} />)}
          <Redirect to={storageURL({ query: namespaceStore.getContextParams() })} />
        </Switch>
      </MainLayout>
    )
  }
}
