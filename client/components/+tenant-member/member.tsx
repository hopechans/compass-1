
import './member.scss'
import * as React from 'react'
import { observer } from "mobx-react";
import { Trans } from "@lingui/macro";
import { RouteComponentProps } from "react-router";
import { cssNames, stopPropagation } from "../../utils";
import { getDetailsUrl } from "../../navigation";
import { apiManager } from "../../api/api-manager";
import { ItemListLayout } from "../item-object-list/item-list-layout";

interface Props{

}

@observer
export class Member extends React.Component<Props>{

    render(){
        return(
            <div>todo...</div>
        )
    }

}