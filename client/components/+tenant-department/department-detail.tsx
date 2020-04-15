import './department-detail.scss'
import * as React from 'react'
import { Trans } from "@lingui/macro";
import { Drawer, DrawerItem, DrawerTitle } from "../drawer";
import { Spinner } from "../spinner";
import { Notifications } from "../notifications";
import { cssNames, stopPropagation } from "../../utils";
import { disposeOnUnmount, observer } from "mobx-react";
import { themeStore } from "../../theme.store";
import { TetantDepartment } from "../../api/endpoints/tenant-department.api";
import { RouteComponentProps } from "react-router";
import { fromPrefixLen } from 'ip';

interface Props {
    selectItem:TetantDepartment
    hideDetails(): void;
}



export class DepartmentDeatil extends React.Component<Props>{

    renderContent(){
        const { selectItem } = this.props
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

    render(){
        const { hideDetails,selectItem } = this.props
        console.log(selectItem)
        const title=selectItem ? selectItem.getName() : ""
        return(
            <Drawer
                className={cssNames("DepartmentDetails", themeStore.activeTheme.type)}
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

