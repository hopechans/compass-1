import "./form.scss"

import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {IFormRouteParams} from "./form.route";
import {formStore} from "./form.store";
import {Field, Form, formApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {AddFormDialog} from "./add-form-dialog";
import {ConfigTreeDialog} from "./config-tree-dialog";
import {SequelFormDialog} from "./sequel-form-dialog";
import {fieldStore} from "./field.store";


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

        console.log('forms',fieldStore.items.map(item => item.getName()))

        return (
            <>
                <KubeObjectListLayout
                    onDetails={() => {}}
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
                <MenuItem onClick={() => SequelFormDialog.open(object)}>
                    <Icon material="code" title={_i18n._(t`Show`)} interactive={toolbar}/>
                    <span className="title"><Trans>Show</Trans></span>
                </MenuItem>
                <MenuItem onClick={() => ConfigTreeDialog.open(object)}>
                    <Icon material="toc" title={_i18n._(t`Tree`)} interactive={toolbar}/>
                    <span className="title"><Trans>Tree</Trans></span>
                </MenuItem>
            </KubeObjectMenu>
            <ConfigTreeDialog/>
            <SequelFormDialog/>
        </>
    )
}

apiManager.registerViews(formApi, {
    Menu: FormMenu,
})
