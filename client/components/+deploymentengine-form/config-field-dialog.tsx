import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {Select, SelectOption} from "../select";
import {onAdd} from "../+deploymentengine";
import {fieldStore} from "../+deploymentengine-field";
import {Field} from "../../api/endpoints";


interface Props extends Partial<DialogProps> {
    handleGData: any
}

@observer
export class ConfigFieldDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static selectNode: any = undefined;
    @observable static gData: any = undefined;
    @observable visible = false;
    @observable field_type = "";

    static open(selectNode: any, gData: any) {
        ConfigFieldDialog.isOpen = true;
        ConfigFieldDialog.selectNode = selectNode;
        ConfigFieldDialog.gData = gData;
    }


    get selectNode() {
        return ConfigFieldDialog.selectNode;
    }

    get gData() {
        return ConfigFieldDialog.gData;
    }

    static close() {
        ConfigFieldDialog.isOpen = false;
    }

    get types() {
        let fieldNames: string[] = []
        setTimeout(() => {fieldNames = fieldStore.items.map((item: Field) => item.getName())}, 3000)
        return fieldNames;
        // return ['container']
    }

    close = () => {
        ConfigFieldDialog.close();
    }

    addForm = async () => {
        if (this.selectNode) {
            const {field_type} = this;
            const gData = onAdd(this.gData, this.selectNode.node, {
                title: field_type,
                key: field_type,
                node_type: "array",
                children: [] as any,
            });
            this.props.handleGData(gData)
            this.close()
        }
    }

    render() {
        const {...dialogProps} = this.props;
        const {field_type} = this;
        const header = <h5><Trans>Config Field</Trans></h5>;

        return (
            <Dialog
                {...dialogProps}
                className="ConfigFieldDialog"
                isOpen={ConfigFieldDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Update</Trans>} next={this.addForm}>
                        <div className="field-type">
                            <SubTitle title={<Trans>Field type</Trans>}/>
                            <Select
                                themeName="light"
                                options={this.types}
                                value={field_type} onChange={({value}: SelectOption) => this.field_type = value}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}