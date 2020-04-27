import './role-detail.scss'
import * as React from 'react'
import { Trans } from "@lingui/macro";
import { Drawer, DrawerItem, DrawerTitle } from "../drawer";
import { Spinner } from "../spinner";
import { Notifications } from "../notifications";
import { cssNames, stopPropagation, autobind } from "../../utils";
import { disposeOnUnmount, observer } from "mobx-react";
import { themeStore } from "../../theme.store";
import { TenantRole } from "../../api/endpoints/tenant-role.api";
import { RouteComponentProps } from "react-router";
import { fromPrefixLen } from 'ip';
import { Checkbox } from "../checkbox";
import { Button } from "../button";
import { permissionsStore } from './role.store.premission'
import { roleStore } from './role.store'
import { autorun, observable, action } from 'mobx';


interface Props {
    selectItem:TenantRole
    hideDetails(): void;
}

interface State{
    curSelect2:Array<any>
}

@observer
export class RoleDeatil extends React.Component<Props,State>{

    @observable curSelect:Array<any> =[]

    changeCheckBox(select:boolean,id:string){
        let d = JSON.parse(JSON.stringify(permissionsStore.curItem))
        if(select === true){
            d.push(id)
        }else{
            for (let i = 0; i < d.length; i++) {
                if (d[i] == id) {
                    d.splice(i, 1);
                    break;
                }
            }
        }
        permissionsStore.changeCurPermission(d)
    }

    @action
    updateCurSelect(data:any){
        this.curSelect = data
    }

    componentDidMount(){
        const { selectItem } = this.props
        if (selectItem) {   
            this.updateCurSelect(selectItem.getPermissions())
        }
       
    }

    @disposeOnUnmount
    clean = autorun(()=>{
        if(permissionsStore.allItem.length>0){
            this.renderContent()
        }
    })

    @action
    clearCurSelect(){
        this.curSelect = []
    }

    @autobind()
    getData(){
        //console.log(permissionsStore.curItem)
    }

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
                <DrawerTitle title={<Trans>Role List</Trans>}/>
                {
                    (permissionsStore.allItem.length === 0)?null:permissionsStore.allItem.map((item,index)=>{
                        const value = permissionsStore.curItem.includes(item.id) 
                        return (
                            <div className="checkbox-list">
                                <Checkbox
                                theme={themeStore.activeTheme.type}
                                label={item.name}
                                value={value}
                                onChange={v=>this.changeCheckBox(v,item.id)}/>
                            </div>

                        )
                    })

                }
                <div className="clear"></div>
                <Button 
                    primary
                    className="save-btn"
                    onClick={this.getData} 
                    // waiting={true}
                    >
                save
                </Button>
                    
            </div>
        )
    }

    render(){
        const { hideDetails,selectItem } = this.props
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

