import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { Trans } from "@lingui/macro";
import { namespaceStore } from "../+namespaces/namespace.store";
import { ovnURL, ovnVlanRoute } from "./ovn.route";
import { Vlan } from "../+ovn-vlan";
interface Props extends RouteComponentProps {}

export class Ovn extends React.Component<Props> {
  static get tabRoutes(): TabRoute[] {
    const query = namespaceStore.getContextParams();
    return [
      {
        title: <Trans>Vlan</Trans>,
        component: Vlan,
        url: ovnURL({ query }),
        path: ovnVlanRoute.path,
      },
    ];
  }
  render() {
    const tabRoutes = Ovn.tabRoutes;
    return (
      <MainLayout>
        <Switch>
          {tabRoutes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
          <Redirect to={tabRoutes[0].url} />
        </Switch>
      </MainLayout>
    );
  }
}
