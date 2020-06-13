import React from "react";
import { Dialog, DialogProps } from "../dialog";
import { t, Trans } from "@lingui/macro";
import { Wizard, WizardStep } from "../wizard";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Notifications } from "../notifications";
import { subNetStore } from "./subnet.route";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { NamespaceSelect } from "../+namespaces/namespace-select";
import { Namespace } from "../../api/endpoints";
import { ExcludeIPsDetails } from "./excludeips-details";

interface Props extends DialogProps {
}

@observer
export class AddSubNetDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable name: string = "";
    @observable protocol: string = "IPV4";
    @observable cidrBlock: string = "";
    @observable gateway: string = "";
    @observable namespaces = observable.array<Namespace>([], { deep: false });
    @observable excludeIps: string[] = [];

    static open() {
        AddSubNetDialog.isOpen = true;
    }

    static close() {
        AddSubNetDialog.isOpen = false;
    }

    close = () => {
        AddSubNetDialog.close();
    }

    reset() {
        this.name = "";
        this.cidrBlock = "";
        this.gateway = "";
    }

    get protocolOptions() {
        return [
            "IPV4"
        ]
    }


    addSubNet = async () => {

        try {
            await subNetStore.create(
                { name: this.name, namespace: '' },
                {
                    spec: {
                        protocol: this.protocol,
                        cidrBlock: this.cidrBlock,
                        gateway: this.gateway,
                        namespaces: this.namespaces,
                        excludeIps: this.excludeIps
                    }
                })
            this.reset();
            this.close();
        } catch (err) {
            Notifications.error(err);
        }

    }

    formatOptionLabel = (option: SelectOption) => {
        const { value, label } = option;
        return label || (
            <>
                <Icon small material="layers" />
                {value}
            </>
        );
    }

    render() {
        const { ...dialogProps } = this.props;
        const unwrapNamespaces = (options: SelectOption[]) => options.map(option => option.value);
        const header = <h5><Trans>Create SubNet</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                isOpen={AddSubNetDialog.isOpen}
                close={this.close}
            >
                <Wizard className="AddSubNetDialog" header={header} done={this.close}>
                    <WizardStep
                        contentClass="flex gaps column"
                        nextLabel={<Trans>Create</Trans>}
                        next={this.addSubNet}
                    >
                        <SubTitle title={<Trans>Name</Trans>} />
                        <Input
                            required autoFocus
                            placeholder={_i18n._(t`Name`)}
                            value={this.name}
                            onChange={(value: string) => this.name = value}
                        />
                        <SubTitle title={<Trans>Protocol</Trans>} />
                        <Select
                            value={this.protocol}
                            options={this.protocolOptions}
                            formatOptionLabel={this.formatOptionLabel}
                            onChange={value => this.protocol = value.value}
                        />
                        <SubTitle title={<Trans>Namespace</Trans>} />
                        <NamespaceSelect
                            isMulti
                            value={this.namespaces}
                            placeholder={_i18n._(t`Namespace`)}
                            themeName="light"
                            className="box grow"
                            onChange={(opts: SelectOption[]) => {
                                if (!opts) opts = [];
                                this.namespaces.replace(unwrapNamespaces(opts));
                            }}
                        />
                        <SubTitle title={<Trans>Gateway</Trans>} />
                        <Input
                            required autoFocus
                            placeholder={_i18n._(t`Gateway`)}
                            value={this.gateway}
                            onChange={(value: string) => this.gateway = value}
                        />
                        <SubTitle title={<Trans>CIDR Block</Trans>} />
                        <Input
                            required autoFocus
                            placeholder={_i18n._(t`CIDR Block`)}
                            value={this.cidrBlock}
                            onChange={(value: string) => this.cidrBlock = value}
                        />
                        <ExcludeIPsDetails
                            value={this.excludeIps} onChange={value => { this.excludeIps = value }} />
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}