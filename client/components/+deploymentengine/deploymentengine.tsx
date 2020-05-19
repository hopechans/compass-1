import React from "react";
import {observer} from "mobx-react";
import {Redirect, Route, Switch} from "react-router";
import {Trans} from "@lingui/macro";
import {MainLayout, TabRoute} from "../layout/main-layout";
import {Graph, graphRoute, graphURL} from "../+deploymentengine-graph";
import {Pages, pageRoute, pageURL} from "../+deploymentengine-page";
import {Forms, formRoute, formURL} from "../+deploymentengine-form";
import {Fields, fieldRoute, fieldURL} from "../+deploymentengine-field";

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
            {
                title: <Trans>Page</Trans>,
                component: Pages,
                url: pageURL(),
                path: pageRoute.path,
            },
            {
                title: <Trans>Form</Trans>,
                component: Forms,
                url: formURL(),
                path: formRoute.path,
            },
            {
                title: <Trans>Field</Trans>,
                component: Fields,
                url: fieldURL(),
                path: fieldRoute.path,
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