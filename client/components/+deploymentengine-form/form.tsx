import "./form.scss"

import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {IFormRouteParams} from "./form.route";
import {formStore} from "./form.store";
import {Form, formApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {AddFormDialog} from "./add-form-dialog";
import {ConfigTreeDialog} from "./config-tree-dialog";


enum sortBy {
    name = "name",
    namespace = "namespace",
    age = "age",
}

interface Props extends RouteComponentProps<IFormRouteParams> {
}


@observer
export class Forms extends React.Component<Props> {

    render() {
        return (
            <>
                <KubeObjectListLayout
                    className="Forms" store={formStore}
                    sortingCallbacks={{
                        [sortBy.name]: (item: Form) => item.getName(),
                        [sortBy.namespace]: (item: Form) => item.getNs(),
                    }}
                    searchFilters={[
                        (item: Form) => item.getSearchFields()
                    ]}
                    renderHeaderTitle={<Trans>Forms</Trans>}
                    renderTableHeader={[
                        {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
                        {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
                        {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
                    ]}
                    renderTableContents={(form: Form) => [
                        form.getName(),
                        form.getNs(),
                        form.getAge(),
                    ]}
                    renderItemMenu={(item: Form) => {
                        return <FormMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddFormDialog.open(),
                        addTooltip: <Trans>Create new Form</Trans>
                    }}
                />
                <AddFormDialog/>
            </>
        );
    }
}


export function FormMenu(props: KubeObjectMenuProps<Form>) {

    const {object, toolbar} = props;
    return (
        <>
            <KubeObjectMenu {...props}>
                <MenuItem onClick={() => ConfigTreeDialog.open(object)}>
                    <Icon material="control_camera" title={_i18n._(t`Modal`)} interactive={toolbar}/>
                    <span className="title"><Trans>Modal</Trans></span>
                </MenuItem>
            </KubeObjectMenu>
            <ConfigTreeDialog/>
        </>
    )
}

apiManager.registerViews(formApi, {
    Menu: FormMenu,
})
