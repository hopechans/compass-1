import React from "react";
import { observer } from "mobx-react";
import { Dialog, DialogProps } from "../dialog";
import { observable } from "mobx";
import { Input } from "../input"
import { Wizard, WizardStep } from "../wizard";
import { t, Trans } from "@lingui/macro";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { NodeSelect } from "../+nodes"
import { apiBase } from "../../api";
import { Notifications } from "../notifications";
import { Namespace } from "../../api/endpoints"
import { SelectOption } from "../select/select";
import { namespaceStore } from "./namespace.store";


interface NodeResourceLimit {
    zone: string;
    rack: string;
    host: string;
}

interface Props extends Partial<DialogProps> {
}

@observer
export class NamespaceNodeRangeLimitDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable static namespace: Namespace;
    @observable nodes = observable.array<any>([], { deep: false });


    static open(namespace: Namespace) {
        NamespaceNodeRangeLimitDialog.isOpen = true;
        NamespaceNodeRangeLimitDialog.namespace = namespace;
    }

    static close() {
        NamespaceNodeRangeLimitDialog.isOpen = false;
    }


    close = () => {
        NamespaceNodeRangeLimitDialog.close();
    }

    reset = () => {
        this.nodes = null;
    }

    onOpen = () => {
        let nodeResourceLimitTemps: NodeResourceLimit[] = [];
        NamespaceNodeRangeLimitDialog.namespace.getAnnotations().map(annotation => {
            const annotationKeyValue = annotation.split("=");
            if (annotationKeyValue[0] == "nuwa.kubernetes.io/default_resource_limit") {
                nodeResourceLimitTemps = JSON.parse(annotationKeyValue[1]);
            }
        })
        nodeResourceLimitTemps.map(node => {
            if (this.nodes === null) { this.nodes = observable.array<any>([], { deep: false }) };
            this.nodes.push(node.host)
        })
    }

    updateAnnotate = async () => {
        const data = {
            namespace: NamespaceNodeRangeLimitDialog.namespace.getName(),
            nodes: new Array<string>()
        };
        this.nodes.map(node => {
            data.nodes.push(node);
        })

        try {
            await apiBase.post("/namespaces/annotation/node", { data }).
                then((data) => {
                    this.reset();
                    this.close();
                })
            Notifications.ok(
                <>
                    {NamespaceNodeRangeLimitDialog.namespace.getName()} annotation successed
                </>);
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const { ...dialogProps } = this.props;
        const unwrapNodes = (options: SelectOption[]) => options.map(option => option.value);
        const header = <h5><Trans>Annotate Node</Trans></h5>;
        return (
            <Dialog
                {...dialogProps}
                className="NamespaceNodeRangeLimitDialog"
                isOpen={NamespaceNodeRangeLimitDialog.isOpen}
                onOpen={this.onOpen}
                close={this.close}
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flow column" nextLabel={<Trans>Annotate</Trans>}
                        next={this.updateAnnotate}>
                        <div className="node">
                            <SubTitle title={<Trans>Annotate Node</Trans>} />
                            <NodeSelect
                                isMulti
                                value={this.nodes}
                                placeholder={_i18n._(t`Node`)}
                                themeName="light"
                                className="box grow"
                                onChange={(opts: SelectOption[]) => {
                                    if (!opts) opts = [];
                                    this.nodes.replace(unwrapNodes(opts));
                                }}
                            />
                        </div>
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}