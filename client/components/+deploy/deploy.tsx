import * as React from "react";
import { observer } from "mobx-react";
import { Redirect, Route, Switch } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { namespaceStore } from "../+namespaces/namespace.store";
import { WorkloadsTemplate } from '../+deploy-workloads-template'
import { deployWorkloadsTemplateRoute,deployWorkloadsTemplateURL} from './deploy.route'
interface Props extends RouteComponentProps {
} 

@observer
export class Deploy extends React.Component<Props>{

    static get tabRoutes():TabRoute[]{
        const query = namespaceStore.getContextParams();
        return [
            {
                title: <Trans>Workloads-Template</Trans>,
                component:WorkloadsTemplate,
                url: deployWorkloadsTemplateURL({query}),
                path:deployWorkloadsTemplateRoute.path
            },
            
        ]
    };
    render(){
        const tabRoutes = Deploy.tabRoutes;
        return (
            <MainLayout className="deploy" tabs={tabRoutes}>
                <Switch>
                    {tabRoutes.map((route, index) => <Route key={index} {...route}/>)}
                    <Redirect to={tabRoutes[0].url}/>
                </Switch>
            </MainLayout>
        )
    }
}