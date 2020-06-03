import React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {Form, DataNode, formApi, Field} from "../../api/endpoints";
import {Dialog, DialogProps} from "../dialog";
import {Tree} from "antd";
import {Wizard, WizardStep} from "../wizard";
import {Trans} from "@lingui/macro";
import {ConfigFormDialog} from "./config-form-dialog";
import {Notifications} from "../notifications";

interface Props extends Partial<DialogProps> {
}

@observer
export class ConfigTreeDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable name = "";
    @observable namespace = "kube-system";
    @observable gData: DataNode[] = [];
    @observable selectNode: any = undefined;
    @observable static data: Form = null;

    static open(form: Form) {
        ConfigTreeDialog.isOpen = true;
        ConfigTreeDialog.data = form;
    }

    static close() {
        ConfigTreeDialog.isOpen = false;
    }

    close = () => {
        ConfigTreeDialog.close();
    }

    get form() {
        return ConfigTreeDialog.data;
    }

    onOpen = () => {
        const {form} = this;
        this.name = form.getName();
        this.gData = form.spec.tree;
    }

    handleGData = (gData: DataNode[]) => {
        this.gData = gData
    }

    updateTree = async () => {
        const {name, namespace} = this;
        this.form.spec.tree = this.gData;
        try {
            await formApi.create({name, namespace}, this.form);
            this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const header = <h5><Trans>Config Tree</Trans></h5>;

        return (
            <>
                <Dialog
                    {...dialogProps}
                    className="ConfigTreeDialog"
                    isOpen={ConfigTreeDialog.isOpen}
                    onOpen={this.onOpen}
                    close={this.close}
                >
                    <Wizard header={header} done={this.close}>
                        <WizardStep contentClass="flow column" nextLabel={<Trans>Update</Trans>} next={this.updateTree}>
                            <Tree
                                className="draggable-tree"
                                multiple={false}
                                autoExpandParent={true}
                                showLine={true}
                                treeData={this.gData}
                                onSelect={(selectedKeys: any, info: any) => {
                                    this.selectNode = info
                                }}
                                onDoubleClick={() => ConfigFormDialog.open(this.selectNode, this.gData)}
                            />
                        </WizardStep>
                    </Wizard>
                </Dialog>
                <ConfigFormDialog handleGData={this.handleGData.bind(this)}/>
            </>
        )
    }

}