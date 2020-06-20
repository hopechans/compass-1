import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {computed, observable} from "mobx";
import {
  Stone,
} from "../../api/endpoints";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {Notifications} from "../notifications";
import {Select} from "../select";
import {stoneStore} from "./stones.store";

interface Props extends Partial<DialogProps> {
}

@observer
export class ConfigStoneDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static Data: Stone = null
  @observable strategy = "";

  static open(object: Stone) {
    ConfigStoneDialog.isOpen = true;
    ConfigStoneDialog.Data = object;
  }

  static close() {
    ConfigStoneDialog.isOpen = false;
  }

  close = () => {
    ConfigStoneDialog.close();
  }

  updateStone = async () => {
    try {
      this.stone.spec.strategy = this.strategy;
      await stoneStore.update(this.stone, {...this.stone})
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  get options() {
    return [
      "Alpha",
      "Beta",
      "Omega",
      "Release"
    ]
  }

  get stone() {
    return ConfigStoneDialog.Data
  }

  onOpen() {
    try {
      this.strategy = this.stone.spec.strategy;
    } catch (e) {
      this.strategy = "";
    }
  }

  render() {
    const {...dialogProps} = this.props;
    const header = <h5><Trans>Update Stone</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        className="ConfigStoneDialog"
        isOpen={ConfigStoneDialog.isOpen}
        onOpen={this.onOpen}
        close={this.close}
      >
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flow column" nextLabel={<Trans>Config Strategy</Trans>} next={this.updateStone}>
            <SubTitle title={<Trans>Stone</Trans>}/>
            <Select
              value={this.strategy}
              placeholder={_i18n._(t`Strategy`)}
              options={this.options}
              themeName="light"
              className="box grow"
              onChange={value => this.strategy = value.value}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}