import * as React from 'react'
import { Trans } from "@lingui/macro";
import { observer,inject} from 'mobx-react'
import { autobind, cssNames } from "../../utils";
import { MenuActions, MenuActionsProps } from "../menu/menu-actions";
import { Department } from './department';
import { hideDetails } from "../../navigation";
import { apiManager } from "../../api/api-manager";
import { Menu, MenuItem, MenuProps } from "../menu";
import { Icon, IconProps } from "../icon";
import { _i18n } from "../../i18n";
import { tetantDepartmentApi } from "../../api/endpoints";
import { AddDepartmentDialog } from './department-dialog-add'
import { TetantDepartment } from "../../api/endpoints/tenant-department.api";
import { departmentStore } from './department.store'


export interface DepartmentMenuProps<T extends Department = any> extends MenuActionsProps {
    object: T;
    editable?: boolean;
    removable?: boolean;
  }
export class DepartmentMenu extends React.Component<DepartmentMenuProps>{
    get store() {
        const { object } = this.props;
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
    
    editDepartment(item:TetantDepartment ){
        AddDepartmentDialog.open()
        departmentStore.changeItemName(item.name)
    }

    @autobind()
      async remove() {
        hideDetails();
        const { object, removeAction } = this.props;
        if (removeAction) await removeAction();
        else await this.store.remove(object);
    }
    
    @autobind()
    renderRemoveMessage() {
        const { object } = this.props;
        const resourceKind = object.kind;
        const resourceName = object.getName();
        return (
          <p><Trans>Remove {resourceKind} <b>{resourceName}</b>?</Trans></p>
        )
      }
    
     render() {
        const { remove, update, renderRemoveMessage, isEditable, isRemovable } = this;
        const { className, object, editable, removable, ...menuProps } = this.props;
        return (
            <MenuActions
                className={cssNames("DepartmentMenu", className)}
                updateAction={isEditable ? update : undefined}
                removeAction={isRemovable ? remove : undefined}
                removeConfirmationMessage={renderRemoveMessage}
            >
                <MenuItem onClick={()=>this.editDepartment(object)}>
                    <Icon material="edit" />
                    <span className="title"><Trans>edit</Trans></span>
                </MenuItem>
            </MenuActions>
        )
      }
}