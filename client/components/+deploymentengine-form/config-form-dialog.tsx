import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {onAdd, onChange, onDelete} from "../+deploymentengine";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {systemName} from "../input/input.validators";
import {Button} from "../button";
import {Icon} from "../icon";
import {ConfigFieldDialog} from "./config-field-dialog";
import {DataNode} from "../../api/endpoints";


interface Props extends Partial<DialogProps> {
    handleGData: any
}

@observer
export class ConfigFormDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static selectNode: any = undefined;
    @observable static gData: any = undefined;
    @observable title = "";
    @observable newFieldTitle = "";
    @observable visible = false;
    @observable field_type = "";

    static open(selectNode: any, gData: any) {
        ConfigFormDialog.isOpen = true;
        ConfigFormDialog.selectNode = selectNode;
        ConfigFormDialog.gData = gData;
    }

    get selectNode() {
        return ConfigFormDialog.selectNode;
    }

    get gData() {
        return ConfigFormDialog.gData;
    }

    static close() {
        ConfigFormDialog.isOpen = false;
    }

    get types() {
        return [
            "string",
            "number",
            "boolean",
        ]
    }

    reset = () => {
        this.newFieldTitle = "";
    }

    handleGData = (gData: DataNode[]) => {
        this.props.handleGData(gData)
    }

    onOpen = () => {
        this.title = this.selectNode.node.title;
    }

    close = () => {
        ConfigFormDialog.close();
    }

    updateForm = async () => {
        if (this.selectNode) {
            const {title, newFieldTitle} = this;
            let thisGData = this.gData
            if (newFieldTitle != "") {
                thisGData = onAdd(thisGData, this.selectNode.node, {
                    title: newFieldTitle,
                    key: newFieldTitle,
                    node_type: "field",
                    children: [] as any,
                });
            }
            thisGData = onChange(thisGData, this.selectNode, title);
            this.props.handleGData(thisGData);
            this.close();
            this.reset();
        }
    }

    deleteForm = () => {
        if (this.selectNode) {
            const gData = onDelete(this.gData, this.selectNode.node);
            this.props.handleGData(gData);
            this.close();
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {title, newFieldTitle} = this;
        const header = <h5><Trans>Config Form</Trans></h5>;

        return (
            <>
                <Dialog
                    {...dialogProps}
                    className="ConfigFormDialog"
                    isOpen={ConfigFormDialog.isOpen}
                    onOpen={this.onOpen}
                    close={this.close}
                >
                    <Wizard header={header} done={this.close}>
                        <WizardStep contentClass="flow column" nextLabel={<Trans>Update</Trans>} next={this.updateForm}>
                            <div className="form-name">
                                <SubTitle title={<Trans>Field name</Trans>}/>
                                <Input
                                    autoFocus required
                                    placeholder={_i18n._(t`Title`)}
                                    validators={systemName}
                                    value={title} onChange={v => this.title = v}
                                />
                            </div>
                            <div className="new-field-title">
                                <SubTitle title={<Trans>Field name</Trans>}/>
                                <Input
                                    autoFocus required
                                    placeholder={_i18n._(t`New Field Title`)}
                                    validators={systemName}
                                    value={newFieldTitle} onChange={v => this.newFieldTitle = v}
                                />
                            </div>
                            <div className="edit-form">
                                <Button round primary onClick={this.deleteForm}>
                                    <Icon
                                        material="delete"
                                        tooltip={_i18n._(t`Delete Form`)}
                                    />
                                </Button>
                                &nbsp;&nbsp;
                                <Button round primary onClick={() => ConfigFieldDialog.open(this.selectNode, this.gData)}>
                                    <Icon
                                        material="add"
                                        tooltip={_i18n._(t`Add Field`)}
                                    />
                                </Button>
                            </div>
                        </WizardStep>
                    </Wizard>
                </Dialog>
                <ConfigFieldDialog handleGData={this.handleGData.bind(this)} />
            </>
        )
    }
}