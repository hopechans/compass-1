
import * as React from 'react'
import { observer } from "mobx-react";
import { Trans } from "@lingui/macro";
import { RouteComponentProps } from "react-router";
import { cssNames, stopPropagation } from "../../utils";
import { getDetailsUrl,getDetails } from "../../navigation";
import { apiManager } from "../../api/api-manager";
import { memberStore } from "./member.store";
import { TetantMember } from "../../api/endpoints/tenant-member.api";
import { computed } from "mobx";
import { ItemListLayout, ItemListLayoutProps } from "../item-object-list/item-list-layout";
import { navigation } from "../../navigation";
import { tenantDepartmentURL } from '../+tenant';
import { AddMemberDialog } from './member-dialog-add'
import { MemberDeatil } from './member-detail'
import { MembertMenu } from './member-menu'
interface IMemberRouteProps{
    id:string
    name:string
}

export interface DepartmentProps extends RouteComponentProps<IMemberRouteProps>{
    store: TetantMember;
}
enum sortBy {
    name = "name",
}

@observer
export class Member extends React.Component<DepartmentProps>{

    constructor(props:any){
        super(props)
    }

    componentDidMount() {
    }

    get selectedRole() {
        const paramsDetail = getDetails()
        return memberStore.items.find(member => {
            return member.getId() == paramsDetail ;
         });
    }

    hideDetails = () => {
        this.showDetails(null);
    }

    showDetails = (item: TetantMember) => {
        if (!item) {
            navigation.searchParams.merge({
                details:null
            })
        }
        else {
          navigation.searchParams.merge({
              details: item.getId(),
          })
        }
    }
    render(){
        return(
            <>
               <ItemListLayout
                    className="tetantMember"
                    store={memberStore}
                    isClusterScoped={true}
                    isSelectable={true}
                    sortingCallbacks={{
                        [sortBy.name]: (item: TetantMember) => item.getName(),
                    }}
                    searchFilters={[
                        (item: TetantMember) => item.getName(),
                        (item: TetantMember) => item.getId(),
                   
                    ]}
                    renderHeaderTitle={<Trans>Member Manager</Trans>}
                    renderTableHeader={[
                        { title: <Trans>ID</Trans>, className: "id" },
                        { title: <Trans>name</Trans>, className: "name", sortBy:sortBy.name},

                    ]}
                    renderTableContents={(item: TetantMember) => [
                        item.getId(),
                        item.getName(),
                    ]}
                    renderItemMenu={(item: TetantMember) => {
                        return <MembertMenu object={item}/>
                    }}
                    addRemoveButtons={{
                        onAdd: () => AddMemberDialog.open(),
                        addTooltip: <Trans>Create new department</Trans>
                    }}
                    detailsItem={this.selectedRole}
                    onDetails={this.showDetails}
                />
                <AddMemberDialog/>
                <MemberDeatil
                    selectItem={this.selectedRole}
                    hideDetails={this.hideDetails}
                >
                </MemberDeatil>
            </>
        )
    }
}


