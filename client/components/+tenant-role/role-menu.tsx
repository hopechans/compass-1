import * as React from 'react'
import {Trans} from "@lingui/macro";
import {autobind, cssNames} from "../../utils";
import {MenuActions, MenuActionsProps} from "../menu/menu-actions";
import {Role} from './role';
import {hideDetails} from "../../navigation";
import {apiManager} from "../../api/api-manager";
import {Menu, MenuItem, MenuProps} from "../menu";
import {Icon, IconProps} from "../icon";
import {AddRoleDialog} from './role-dialog-add'
import {TenantRole} from "../../api/endpoints/tenant-role.api";
import {roleStore} from './role.store'


export interface RoleMenuProps<T extends Role = any> extends MenuActionsProps {
    object: T;
    editable?: boolean;
    removable?: boolean;
}

export class RoleMenu extends React.Component<RoleMenuProps> {
    get store() {
        const {object} = this.props;
        if (!object) return;
        return apiManager.getStore(object.selfLink);
    }

    get isEditable() {
        return false
    }

    get isRemovable() {
        return true
    }

    @autobind()
    async update() {
        hideDetails();
    }

    editDepartment(item: TenantRole) {
        AddRoleDialog.open()
        roleStore.changeItemName(item.name)
        roleStore.changeDialogType('edit')
    }

    @autobind()
    async remove() {
        hideDetails();
        const {object, removeAction} = this.props;
        if (removeAction) await removeAction();
        else await this.store.remove(object);
    }

    @autobind()
    renderRemoveMessage() {
        const {object} = this.props;
        const resourceKind = object.kind;
        const resourceName = object.getName();
        return (
            <p><Trans>Remove {resourceKind} <b>{resourceName}</b>?</Trans></p>
        )
    }

    render() {
        const {remove, update, renderRemoveMessage, isEditable, isRemovable} = this;
        const {className, object, editable, removable, ...menuProps} = this.props;
        return (
            <MenuActions
                className={cssNames("RoleMenu", className)}
                updateAction={isEditable ? update : undefined}
                removeAction={isRemovable ? remove : undefined}
                removeConfirmationMessage={renderRemoveMessage}
            >
                <MenuItem onClick={() => this.editDepartment(object)}>
                    <Icon material="edit"/>
                    <span className="title"><Trans>Edit</Trans></span>
                </MenuItem>
            </MenuActions>
        )
    }
}