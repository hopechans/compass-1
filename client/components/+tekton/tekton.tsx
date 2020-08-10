import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { Trans } from "@lingui/macro";
import { namespaceStore } from "../+namespaces/namespace.store";
import { Pipelines } from "../+tekton-pipeline";
import { PipelineRuns } from "../+tekton-pipelinerun";
import { PipelineResources } from "../+tekton-pipelineresource";
import {
  pipelineURL,
  pipelineRoute,
  pipelineRunURL,
  pipelineRunRoute,
  pipelineResourceURL,
  pipelineResourceRoute,
  taskURL,
  taskRoute,
  taskRunURL,
  taskRunRoute,
  opsSecretURL,
  opsSecretRoute,
  tektonStoreRoute,
  tektonStoreURL,
} from "./tekton.route";
import { Tasks } from "../+tekton-task";
import { TaskRuns } from "../+tekton-taskrun";
import { OpsSecrets } from "../+tekton-ops-secret";
import { TektonStoreDetail } from "../+tekton-store";

interface Props extends RouteComponentProps {}

export class Tekton extends React.Component<Props> {
  static get tabRoutes(): TabRoute[] {
    const query = namespaceStore.getContextParams();
    return [
      {
        title: <Trans>Pipeline</Trans>,
        component: Pipelines,
        url: pipelineURL({ query }),
        path: pipelineRoute.path,
      },
      {
        title: <Trans>PipelineRun</Trans>,
        component: PipelineRuns,
        url: pipelineRunURL({ query }),
        path: pipelineRunRoute.path,
      },
      {
        title: <Trans>PipelineResource</Trans>,
        component: PipelineResources,
        url: pipelineResourceURL({ query }),
        path: pipelineResourceRoute.path,
      },
      {
        title: <Trans>Task</Trans>,
        component: Tasks,
        url: taskURL({ query }),
        path: taskRoute.path,
      },
      {
        title: <Trans>TaskRun</Trans>,
        component: TaskRuns,
        url: taskRunURL({ query }),
        path: taskRunRoute.path,
      },
      {
        title: <Trans>Config</Trans>,
        component: OpsSecrets,
        url: opsSecretURL({ query }),
        path: opsSecretRoute.path,
      },
      {
        title: <Trans>Store</Trans>,
        component: TektonStoreDetail,
        url: tektonStoreURL({ query }),
        path: tektonStoreRoute.path,
      },
    ];
  }

  render() {
    const tabRoutes = Tekton.tabRoutes;
    return (
      <MainLayout tabs={tabRoutes}>
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
