import "./add-ingress-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {Notifications} from "../notifications";
import {Collapse} from "../collapse";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {Backend, backend, BackendDetails, MultiRuleDetails, Rule, TlsDetails, Tls} from "../+network-ingress-details";
import {Ingress} from "../../api/endpoints";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {ingressStore} from "./ingress.store";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddIngressDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name = "";
  @observable namespace = "";
  @observable tls: Tls[] = [];
  @observable rules: Rule[] = [];
  @observable backend: Backend = backend

  static open() {
    AddIngressDialog.isOpen = true;
  }

  static close() {
    AddIngressDialog.isOpen = false;
  }

  close = () => {
    AddIngressDialog.close();
  }

  createIngress = () => {
    let data: Partial<Ingress> = {
      spec: {
        tls: this.tls.map(item => {
          return {hosts: item.hosts, secretName: item.secretName};
        }).slice(),
        rules: JSON.parse(JSON.stringify(this.rules)),
      }
    }
    if (this.backend.serviceName != "" && this.backend.servicePort != 0) {
      data.spec.backend = JSON.parse(JSON.stringify(this.backend))
    }
    try {
      ingressStore.create({name: this.name, namespace: this.namespace}, {...data})
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const {...dialogProps} = this.props;
    const header = <h5><Trans>Create Ingress</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        isOpen={AddIngressDialog.isOpen}
        close={this.close}
      >
        <Wizard className="AddIngressDialog" header={header} done={this.close}>
          <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createIngress}>
            <SubTitle title={<Trans>Namespace</Trans>}/>
            <NamespaceSelect
              themeName="light"
              title={"namespace"}
              value={this.namespace}
              onChange={({value}) => this.namespace = value}
            />
            <SubTitle title={<Trans>Name</Trans>}/>
            <Input
              required={true}
              title={"Name"}
              value={this.name}
              onChange={value => this.name = value}
            />
            <Collapse panelName={<Trans>Rules</Trans>}>
              <MultiRuleDetails
                value={this.rules}
                onChange={value => this.rules = value}/>
            </Collapse>
            <Collapse panelName={<Trans>Backend</Trans>}>
              <BackendDetails
                value={this.backend}
                onChange={value => this.backend = value}
              />
            </Collapse>
            <Collapse panelName={<Trans>Transport Layer Security</Trans>}>
              <TlsDetails
                value={this.tls}
                onChange={value => this.tls = value}
              />
            </Collapse>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}