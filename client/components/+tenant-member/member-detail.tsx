import * as React from 'react'
import {Trans} from "@lingui/macro";
import {Drawer, DrawerItem, DrawerTitle} from "../drawer";
import {Spinner} from "../spinner";
import {Notifications} from "../notifications";
import {cssNames, stopPropagation} from "../../utils";
import {disposeOnUnmount, observer} from "mobx-react";
import {themeStore} from "../../theme.store";
import {tenantMemberApi, TenantMember} from "../../api/endpoints/tenant-member.api";
import {RouteComponentProps} from "react-router";
import {fromPrefixLen} from 'ip';

interface Props {
    selectItem: TenantMember

    hideDetails(): void;
}


export class MemberDeatil extends React.Component<Props> {

    renderContent() {
        const {selectItem} = this.props
        if (!selectItem) return null;
        return (
            <div>
                <DrawerItem name={<Trans>Name</Trans>}>
                    {selectItem.getName()}
                </DrawerItem>
                <DrawerItem name={<Trans>Name</Trans>}>
                    {selectItem.getName()}
                </DrawerItem>
                <DrawerItem name={<Trans>Name</Trans>}>
                    {selectItem.getName()}
                </DrawerItem>
            </div>
        )
    }

    render() {
        const {hideDetails, selectItem} = this.props
        const title = selectItem ? selectItem.getName() : ""
        return (
            <Drawer
                className={cssNames("MemberDetails", themeStore.activeTheme.type)}
                usePortal={true}
                open={!!selectItem}
                title={title}
                onClose={hideDetails}
            >
                {this.renderContent()}
            </Drawer>
        )
    }
}

