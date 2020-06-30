import "./add-config-map-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {Notifications} from "../notifications";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {ConfigMapDataDetails} from "./config-map-data-details";
import {Collapse} from "../collapse";
import {Data} from "./common";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddConfigMapDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name = "";
  @observable data: Data[] = [];

  static open() {
    AddConfigMapDialog.isOpen = true;
  }

  static close() {
    AddConfigMapDialog.isOpen = false;
  }

  close = () => {
    AddConfigMapDialog.close();
  }

  reset = () => {
    this.name = "";
    this.data = [];
  }

  createConfigMap = async () => {
    try {
      // unfinished api
      let dataMap = new Map<string, string>();
      this.data.map((item, index) => {
        dataMap.set(item.key, item.value)
      })

      console.log(dataMap)

      this.reset();
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const {...dialogProps} = this.props;
    const header = <h5><Trans>Create Config Map</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        isOpen={AddConfigMapDialog.isOpen}
        close={this.close}
      >
        <Wizard className="AddConfigMapDialog" header={header} done={this.close}>
          <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createConfigMap}>
            <SubTitle title={"Name"}/>
            <Input
              required={true}
              value={this.name}
              onChange={value => this.name = value}
            />
            <Collapse panelName={<Trans>Data</Trans>}>
              <ConfigMapDataDetails
                value={this.data}
                onChange={value => this.data = value}
              />
            </Collapse>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}