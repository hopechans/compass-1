import React from "react";
import {observer} from "mobx-react";
import {Redirect, Route, Switch} from "react-router";
import {Trans} from "@lingui/macro";
import {MainLayout, TabRoute} from "../layout/main-layout";
import {Graph, graphRoute, graphURL} from "../+deploymentengine-graph";

@observer
export class DeploymentEngine extends React.Component {
    static get tabRoutes(): TabRoute[] {
        return [
            {
                title: <Trans>Graph</Trans>,
                component: Graph,
                url: graphURL(),
                path: graphRoute.path,
            },
        ]
    }

    render() {
        const tabRoutes = DeploymentEngine.tabRoutes;
        return (
            <MainLayout className="DeploymentEngine" tabs={tabRoutes}>
                <Switch>
                    {tabRoutes.map((route, index) => <Route key={index} {...route}/>)}
                    <Redirect to={tabRoutes[0].url}/>
                </Switch>
            </MainLayout>
        )
    }
}