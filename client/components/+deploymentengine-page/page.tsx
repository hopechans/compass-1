import "./page.scss";

import * as React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { IPageRouteParams } from "./page.route";
import { pageStore } from "./page.store";
import { Page, pageApi } from "../../api/endpoints/page.api";
import { apiManager } from "../../api/api-manager";

enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}

interface Props extends RouteComponentProps<IPageRouteParams> {
}

@observer
export class Pages extends React.Component<Props> {
    spec: { scaleTargetRef: any; };

    render() {
        return (
            <KubeObjectListLayout
                className="Pages" store={pageStore}
                sortingCallbacks={{
                    [sortBy.name]: (item: Page) => item.getName(),
                    [sortBy.namespace]: (item: Page) => item.getNs(),
                }}
                searchFilters={[
                    (item: Page) => item.getSearchFields()
                ]}
                renderHeaderTitle={<Trans>Pages</Trans>}
                renderTableHeader={[
                    { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
                    { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
                    { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
                ]}
                renderTableContents={(page: Page) => [
                    page.getName(),
                    page.getNs(),
                    page.getAge(),
                ]}
                renderItemMenu={(item: Page) => {
                    return <PageMenu object={item}/>
                }}
            />
        );
    }
}

export function PageMenu(props: KubeObjectMenuProps<Page>) {
    return (
        <KubeObjectMenu {...props}/>
    )
}

apiManager.registerViews(pageApi, {
    Menu: PageMenu,
})
