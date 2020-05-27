import * as React from 'react'
import { RouteComponentProps } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import { MainLayout,TabRoute } from "../layout/main-layout";
import { Trans } from "@lingui/macro";
import { namespaceStore } from "../+namespaces/namespace.store";
import { Pipeline } from '../+tekton-pipeline'
import { pipelineURL, pipelineRoute} from './tekton.route'

interface Props extends RouteComponentProps {}

export class Tekton extends React.Component{
  static get tabRoutes():TabRoute[]{
    const query = namespaceStore.getContextParams();
    return [
      {
          title: <Trans>Pipeline</Trans>,
          component:Pipeline,
          url: pipelineURL({query}),
          path:pipelineRoute.path
      },
        
    ]
  };
  render() {
    const tabRoutes = Tekton.tabRoutes;
    return (
      <MainLayout>
        <Switch>
            {tabRoutes.map((route, index) => <Route key={index} {...route}/>)}
            <Redirect to={tabRoutes[0].url}/>
        </Switch>
      </MainLayout>
    )
  }
} 