import * as React from 'react'
import { Trans } from "@lingui/macro";
import { observer,inject} from 'mobx-react'
import { autobind, cssNames } from "../../utils";
import { MenuActions, MenuActionsProps } from "../menu/menu-actions";
import { Member } from './member';
import { hideDetails } from "../../navigation";
import { apiManager } from "../../api/api-manager";
import { Menu, MenuItem, MenuProps } from "../menu";
import { Icon, IconProps } from "../icon";
import { _i18n } from "../../i18n";
import { tetantDepartmentApi } from "../../api/endpoints";
import { AddMemberDialog } from './member-dialog-add'
import { TetantDepartment } from "../../api/endpoints/tenant-department.api";
import { memberStore } from './member.store'


export interface MembertMenuProps<T extends Member = any> extends MenuActionsProps {
    object: T;
    editable?: boolean;
    removable?: boolean;
  }
export class MembertMenu extends React.Component<MembertMenuProps>{
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
    
    editMember(item:TetantDepartment ){
        AddMemberDialog.open()
        memberStore.changeItemName(item.name)
        memberStore.changeDialogType('edit')
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
                className={cssNames("MemberMenu", className)}
                updateAction={isEditable ? update : undefined}
                removeAction={isRemovable ? remove : undefined}
                removeConfirmationMessage={renderRemoveMessage}
            >
                <MenuItem onClick={()=>this.editMember(object)}>
                    <Icon material="edit" />
                    <span className="title"><Trans>Edit</Trans></span>
                </MenuItem>
            </MenuActions>
        )
      }
}