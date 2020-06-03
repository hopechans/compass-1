import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {tenantUserStore} from "./user.store";
import {TenantUser, tenantUserApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";

import {AddUserDialog} from "./add-user-dialog";

enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}


interface UserProps {}

interface Props extends RouteComponentProps<UserProps> {
}

@observer
export class TenantUsers extends React.Component<Props> {
    spec: { scaleTargetRef: any; };

    render() {
        return (
            <>
                <KubeObjectListLayout
                    className="Users" store={tenantUserStore}
                    sortingCallbacks={{
                        [sortBy.name]: (item: TenantUser) => item.getName(),
                        [sortBy.namespace]: (item: TenantUser) => item.getNs(),
                    }}
                    searchFilters={[
                        (item: TenantUser) => item.getSearchFields()
                    ]}
                    renderHeaderTitle={<Trans>Users</Trans>}
                    renderTableHeader={[
                        {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                        {title: <Trans>Department</Trans>, className: "department"},
                        {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(user: TenantUser) => [
                        user.getName(),
                        user.spec.department_id,
                        user.getNs(),
                        user.getAge(),
                    ]}
                    renderItemMenu={(item: TenantUser) => {
                        return <TenantUserMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddUserDialog.open(),
                        addTooltip: <Trans>Create new User</Trans>
                    }}
                />
                <AddUserDialog/>
            </>
        );
    }
}

export function TenantUserMenu(props: KubeObjectMenuProps<TenantUser>) {
    return (
        <>
            <KubeObjectMenu {...props} />
        </>
    )
}

apiManager.registerViews(tenantUserApi, {
    Menu: TenantUserMenu,
})
