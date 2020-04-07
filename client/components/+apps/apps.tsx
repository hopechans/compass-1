import React from "react";
import { observer } from "mobx-react";
import { Redirect, Route, Switch } from "react-router";
import { Trans } from "@lingui/macro";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { HelmCharts, helmChartsRoute, helmChartsURL } from "../+apps-helm-charts";
import { HelmReleases, releaseRoute, releaseURL } from "../+apps-releases";
import { namespaceStore } from "../+namespaces/namespace.store";


export class Apps extends React.Component {
  static get tabRoutes(): TabRoute[] {
    const query = namespaceStore.getContextParams();
    return [
      // {
      //   title: <Trans>Charts</Trans>,
      //   component: HelmCharts,
      //   url: helmChartsURL(),
      //   path: helmChartsRoute.path,
      // },
      // {
      //   title: <Trans>Releases</Trans>,
      //   component: HelmReleases,
      //   url: releaseURL({ query }),
      //   path: releaseRoute.path,
      // },
      {
        title: <Trans>Charts</Trans>,
        component: HelmCharts,
        url: '',
        path: '',
      },
      {
        title: <Trans>Releases</Trans>,
        component: HelmReleases,
        url:'',
        path:'',
      },
    ]
  }

  render() {
    const tabRoutes = Apps.tabRoutes;
    return (
      <MainLayout className="Apps">
        <Switch>
          {tabRoutes.map((route, index) => <Route key={index} {...route}/>)}
          <Redirect to={tabRoutes[0].url}/>
        </Switch>
      </MainLayout>
    )
  }
}
