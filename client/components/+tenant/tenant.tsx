import './tenant.scss'
import * as React from "react";
import { observer } from "mobx-react";
import { Redirect, Route, Switch } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { Department} from '../+tenant-department'
import { Member} from '../+tenant-member'
import { Role} from '../+tenant-role'
import { namespaceStore } from "../+namespaces/namespace.store";
import { tenantURL,tenantDepartmentURL,tenantRoleURL,tenantMemberURL,tenantDepartmentRoute,tenantRoleRoute,tenantMemberRoute} from './tenant.route'
interface Props extends RouteComponentProps {
} 

@observer
export class Tenant extends React.Component<Props>{

    static get tabRoutes():TabRoute[]{
        const query = namespaceStore.getContextParams();
        return [
            {
                title: <Trans>Department</Trans>,
                component:Department,
                url: tenantDepartmentURL({query}),
                path:tenantDepartmentRoute.path
            },
            {
                title: <Trans>Role</Trans>,
                component:Role,
                url: tenantRoleURL({query}),
                path:tenantRoleRoute.path
            },
            {
                title: <Trans>Member</Trans>,
                component:Member,
                url: tenantMemberURL({query}),
                path:tenantMemberRoute.path
            }
        ]
    };
    render(){
        const tabRoutes = Tenant.tabRoutes;
        return (
            <MainLayout className="tenant" tabs={tabRoutes}>
                <Switch>
                    {tabRoutes.map((route, index) => <Route key={index} {...route}/>)}
                    <Redirect to={tabRoutes[0].url}/>
                </Switch>
            </MainLayout>
        )
    }
}