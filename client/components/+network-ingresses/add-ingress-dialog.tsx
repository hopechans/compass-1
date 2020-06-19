import "./add-ingress-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {Notifications} from "../notifications";
import {Collapse} from "antd";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {Backend, backend, BackendDetails, MultiRuleDetails, Rule, TlsDetails} from "../+network-ingress-details";

const {Panel} = Collapse;

interface Props extends Partial<DialogProps> {
}

@observer
export class AddIngressDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name = "";
  @observable tls: string[] = [];
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

  reset = () => {
    this.name = "";
  }

  createIngress = async () => {
    try {
      // unfinished api
      this.reset();
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
            <SubTitle title={"Name"}/>
            <Input
              required={true}
              value={this.name}
              onChange={value => this.name = value}
            />
            <br/>
            <Collapse>
              <Panel key={"Rules"} header={"Rules"}>
                <MultiRuleDetails
                  value={this.rules}
                  onChange={value => this.rules = value}/>
              </Panel>
            </Collapse>
            <br/>
            <Collapse>
              <Panel key={"Backend"} header={"Backend"}>
                <BackendDetails
                  value={this.backend}
                  onChange={value => this.backend = value}
                />
              </Panel>
            </Collapse>
            <br/>
            <Collapse>
              <Panel key={"Transport Layer Security"} header={"Transport Layer Security"}>
                <TlsDetails
                  value={this.tls}
                  onChange={value => this.tls = value}
                />
              </Panel>
            </Collapse>

          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}