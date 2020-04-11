
import React from 'react'
import { observer } from 'mobx-react'
import { observable} from 'mobx'
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";
import { Dialog, DialogProps } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Input } from "../input";
import { SubTitle } from "../layout/sub-title";
import { systemName } from "../input/input.validators";
import { Notifications } from "../notifications";
import { tetantDepartmentApi } from '../../api/endpoints/tenant-department.api'

interface Props extends Partial<DialogProps> {
}


@observer
export class AddDepartmentDialog extends React.Component<Props>{
    @observable static isOpen = false;
    @observable name = "";


    static open(){
        console.log('---open')
        AddDepartmentDialog.isOpen = true
    }

    static close(){
        AddDepartmentDialog.isOpen = false
    }

    reset = () => {
        this.name = "";
    }

    close = () => {
        AddDepartmentDialog.close();
    }



    createDepartment = async () => {
        const { name} = this;
        try {
            console.log(name)
            await tetantDepartmentApi.createApi()
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
      }

    render(){
        const { name } = this;
        const header = <h5><Trans>Create Department</Trans></h5>;
        return(
            <Dialog
                className="AddDepartmentDialog"
                isOpen={AddDepartmentDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createDepartment}>
                        <div className="secret-name">
                            <SubTitle title={<Trans>部门名称</Trans>}/>
                            <Input
                                autoFocus required
                                placeholder={_i18n._(t`Name`)}
                                validators={systemName}
                                value={name} onChange={v => this.name = v}
                            />
                        </div>
                    
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}