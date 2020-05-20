import "./deploy.store.ts";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Deploy, deployApi } from "../../api/endpoints";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { KubeObjectListLayout } from "../kube-object";
import { IDeployWorkloadsParams } from "../+deploy";
import { apiManager } from "../../api/api-manager";
import { deployStore } from "./deploy.store";

enum sortBy {
    templateName = "templateName",
    namespace = "namespace",
    appName = "appName",
    generateTimestamp = "generateTimestamp",
    age = "age",
}

interface Props extends RouteComponentProps<IDeployWorkloadsParams> {
}

@observer
export class Deploys extends React.Component<Props> {

    render() {
        return (
            <MainLayout>
                <KubeObjectListLayout
                    className="Deploy" store={deployStore}
                    sortingCallbacks={{
                        [sortBy.templateName]: (deploy: Deploy) => deploy.getName(),
                        [sortBy.namespace]: (deploy: Deploy) => deploy.getNs(),
                        [sortBy.generateTimestamp]: (deploy: Deploy) => deploy.getGenerateTimestamp(),
                        [sortBy.age]: (deploy: Deploy) => deploy.getAge(false),
                    }
                    }

                    searchFilters={
                        [
                            (deploy: Deploy) => deploy.getSearchFields(),
                        ]}

                    renderHeaderTitle={< Trans > Deploys </Trans >}
                    renderTableHeader={
                        [
                            { title: <Trans>TemplateName</Trans>, className: "template", sortBy: sortBy.templateName },
                            { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
                            { title: <Trans>AppName</Trans>, className: "appName", sortBy: sortBy.appName },
                            { title: <Trans>GenerateTimestamp</Trans>, className: "generateTimestamp", sortBy: sortBy.generateTimestamp },
                            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
                        ]}

                    renderTableContents={(deploy: Deploy) => [
                        deploy.getName(),
                        deploy.getNs(),
                        deploy.getAppName(),
                        new Date(deploy.getGenerateTimestamp() * 1e3).toISOString(),
                        deploy.getAge(),
                    ]}

                    renderItemMenu={(item: Deploy) => {
                        return <DeployMenu object={item} />
                    }}
                />
            </MainLayout>
        )
    }
}

export function DeployMenu(props: KubeObjectMenuProps<Deploy>) {
    return (
        <KubeObjectMenu {...props} />
    )
}

apiManager.registerViews(deployApi, {
    Menu: DeployMenu,
})
