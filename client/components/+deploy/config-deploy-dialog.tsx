import React from "react";
import { observer } from "mobx-react";
import { Dialog, DialogProps } from "../dialog";
import { observable } from "mobx";
import { Namespace } from "../../api/endpoints";
import { Input } from "../input"
import { Wizard, WizardStep } from "../wizard";
import { t, Trans } from "@lingui/macro";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { NamespaceSelect } from "../+namespaces/namespace-select";
import { apiBase } from "../../api";
import { Notifications } from "../notifications";

interface Props extends Partial<DialogProps> {
}

@observer
export class ConfigDeployDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static appName = "";
    @observable static templateName = "";
    @observable namespace = "";
    @observable replicas = "1";

    static open(appName: string, templateName: string) {
        ConfigDeployDialog.isOpen = true;
        ConfigDeployDialog.appName = appName;
        ConfigDeployDialog.templateName = templateName;
    }

    static close() {
        ConfigDeployDialog.isOpen = false;
    }

    get appName() {
        return ConfigDeployDialog.appName;
    }

    get templateName() {
        return ConfigDeployDialog.templateName;
    }

    close = () => {
        ConfigDeployDialog.close();
    }

    reset = () => {
        ConfigDeployDialog.appName = "";
        ConfigDeployDialog.templateName = "";
        this.namespace = "";
    }

    updateDeploy = async () => {
        const data = {
            appName: this.appName,
            templateName: this.templateName,
            namespace: this.namespace,
            replicas: this.replicas,
        }
        try {
            await apiBase.post("/deploy", { data }).
                then((data) => {
                    this.reset();
                    this.close();
                })
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const { ...dialogProps } = this.props;
        const header = <h5><Trans>Deploy</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="ConfigDeployDialog"
                isOpen={ConfigDeployDialog.isOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>}
                        next={this.updateDeploy}>
                        <div className="namespace">
                            <SubTitle title={<Trans>Namespace</Trans>} />
                            <NamespaceSelect
                                value={this.namespace}
                                placeholder={_i18n._(t`Namespace`)}
                                themeName="light"
                                className="box grow"
                                onChange={(v) => { this.namespace = v }}
                            />
                            <SubTitle title={<Trans>Replicas</Trans>} />
                            <Input
                                autoFocus
                                placeholder={_i18n._(t`Replicas`)}
                                value={this.replicas}
                                onChange={v => this.replicas = v}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}