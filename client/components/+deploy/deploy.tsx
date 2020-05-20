import * as React from "react";
import { observer } from "mobx-react";
import { Redirect, Route, Switch } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { MainLayout, TabRoute } from "../layout/main-layout";
interface Props extends RouteComponentProps {
} 

@observer
export class Deploy extends React.Component<Props>{
    
    render(){
        return (
            <MainLayout>
                <div>todo...</div>
           </MainLayout>
        )
    }
}