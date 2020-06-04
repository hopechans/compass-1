import "./app.scss";
import React from "react";
import { render } from "react-dom";
import { Redirect, Route, Router, Switch } from "react-router";
import { observer } from "mobx-react";
import { I18nProvider } from '@lingui/react'
import { _i18n, i18nStore } from "../i18n";
import { browserHistory } from "../navigation";
import { Notifications } from "./notifications";
import { NotFound } from "./+404";
import { configStore } from "../config.store";
import { UserManagement } from "./+user-management/user-management";
import { ConfirmDialog } from "./confirm-dialog";
import { usersManagementRoute } from "./+user-management/user-management.routes";
import { clusterRoute, clusterURL } from "./+cluster";
import { KubeConfigDialog } from "./kubeconfig-dialog/kubeconfig-dialog";
import { Nodes, nodesRoute } from "./+nodes";
import { Deploys, deployURL, deployRoute } from "./+deploy";
import { Workloads, workloadsRoute, workloadsURL } from "./+workloads";
import { Tenant, tenantURL, tenantRoute } from "./+tenant";
import { Namespaces, namespacesRoute } from "./+namespaces";
import { Network, networkRoute } from "./+network";
import { Storage, storageRoute } from "./+storage";
import { Cluster } from "./+cluster/cluster";
import { Config, configRoute } from "./+config";
import { Events } from "./+events/events";
import { Login } from "./+login";
import { Tekton, tektonRoute } from "./+tekton";
import { eventRoute } from "./+events";
import { ErrorBoundary } from "./error-boundary";
import { Apps, appsRoute, appsURL } from "./+apps";
import { KubeObjectDetails } from "./kube-object/kube-object-details";
import { AddRoleBindingDialog } from "./+user-management-roles-bindings";
import { PodLogsDialog } from "./+workloads-pods/pod-logs-dialog";
import { DeploymentScaleDialog } from "./+workloads-deployments/deployment-scale-dialog";
import { CustomResources } from "./+custom-resources/custom-resources";
import { crdRoute } from "./+custom-resources";
import { DeploymentEngine } from "./+deploymentengine";
import { deploymentEngineRoute, deploymentEngineURL } from "./+deploymentengine";
import 'antd/dist/antd.css';
@observer
class App extends React.Component {
  static rootElem = document.getElementById('app');

  static async init() {
    await i18nStore.init();
    // await configStore.load();

    // render app
    render(<App />, App.rootElem);
  };

  async stratConfigStoreLoad() {
    await configStore.load();
  }

  render() {
    let homeUrl = ''
    const userName = localStorage.getItem('u_userName')
    const admin = localStorage.getItem('u_admin')
    if (userName) {
      homeUrl = admin == 'true' ? clusterURL() : workloadsURL();
    } else {
      homeUrl = '/login'
    }
    return (
      <div>

        <I18nProvider i18n={_i18n}>
          <Router history={browserHistory}>
            <ErrorBoundary>
              <Switch>
                <Route component={Cluster} {...clusterRoute} />
                <Route component={Nodes} {...nodesRoute} />
                <Route component={DeploymentEngine} {...deploymentEngineRoute} />
                <Route component={Deploys} {...deployRoute} />
                <Route component={Workloads} {...workloadsRoute} />
                <Route component={Config} {...configRoute} />
                <Route component={Network} {...networkRoute} />
                <Route component={Storage} {...storageRoute} />
                <Route component={Namespaces} {...namespacesRoute} />
                <Route component={Events} {...eventRoute} />
                <Route component={Tekton} {...tektonRoute} />
                <Route component={CustomResources} {...crdRoute} />
                <Route component={UserManagement} {...usersManagementRoute} /> */}
                    <Route component={Apps} {...appsRoute} />
                <Route component={Tenant} {...tenantRoute} />
                <Route component={Login} path="/login" />
                <Redirect exact from="/" to={homeUrl} />
                <Route path="*" component={NotFound} />
                {/* // <Route component={Cluster} {...clusterRoute}/>
                    // <Route component={Workloads} {...workloadsRoute}/>
                    // <Route component={Apps} path="/"/> */}
              </Switch>
              <KubeObjectDetails />
              <Notifications />
              <ConfirmDialog />
              <KubeConfigDialog />
              <AddRoleBindingDialog />
              <PodLogsDialog />
              <DeploymentScaleDialog />
            </ErrorBoundary>
          </Router>
        </I18nProvider>
      </div>

    )
  }
}

// run app
App.init();
