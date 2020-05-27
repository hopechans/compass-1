import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Page, pageApi} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Notifications} from "../notifications";
import {showDetails} from "../../navigation";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddPageDialog extends React.Component<Props> {

    @observable static isOpen = false;

    static open() {
        AddPageDialog.isOpen = true;
    }

    static close() {
        AddPageDialog.isOpen = false;
    }

    @observable name = "";
    @observable namespace = "kube-system";

    close = () => {
        AddPageDialog.close();
    }

    reset = () => {
        this.name = "";
    }

    createPage = async () => {
        const {name, namespace} = this;
        const page: Partial<Page> = {
            spec: {
                tree: "[]"
            }
        }
        try {
            const newPage = await pageApi.create({namespace, name}, page);
            showDetails(newPage.selfLink);
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {name} = this;
        const header = <h5><Trans>Create Page</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="AddPageDialog"
                isOpen={AddPageDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createPage}>
                        <div className="page-name">
                            <SubTitle title={<Trans>Field name</Trans>}/>
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