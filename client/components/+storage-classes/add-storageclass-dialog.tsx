import "./add-storageclass-dialog.scss"

import React from "react";
import { Dialog, DialogProps } from "../dialog";
import { t, Trans } from "@lingui/macro";
import { Wizard, WizardStep } from "../wizard";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storageClassStore } from "./storage-class.store";
import { Input } from "../input";
import { _i18n } from "../../i18n";
import { Select, SelectOption } from "../select";
import { Icon } from "../icon";
import { SubTitle } from "../layout/sub-title";
import { cephParams, CephParams } from "./common";
import { SecretsSelect } from "../+config-secrets/secrets-select";
import { NamespaceSelect } from "../+namespaces/namespace-select";
import { Notifications } from "../notifications";
import { storageClassApi } from "../../api/endpoints";

interface Props extends DialogProps {
}

@observer
export class AddStorageClassDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name: string = "";
  @observable provisioner: string = "ceph.com/rbd";
  @observable volumeBindingMode: string = "Immediate";
  @observable reclaimPolicy: string = "Retain";
  @observable params: CephParams = cephParams;
  @observable userSecretNamespace = "";

  static open() {
    AddStorageClassDialog.isOpen = true;
  }

  static close() {
    AddStorageClassDialog.isOpen = false;
  }

  close = () => {
    AddStorageClassDialog.close();
  }

  reset() {
    this.name = "";
    this.params = cephParams;
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

  get provisionerOptions() {
    return [
      "ceph.com/rbd"
    ]
  }

  get volumeBindingModeOptions() {
    return [
      "Immediate"
    ]
  }

  get reclaimPolicyOptions() {
    return [
      "Delete",
      "Retain",
    ]
  }

  addStorageClass = async () => {

    try {
      await storageClassApi.create({ name: this.name, namespace: '' }, {
        provisioner: this.provisioner,
        volumeBindingMode: this.volumeBindingMode,
        reclaimPolicy: this.reclaimPolicy,
        parameters: {
          adminSecretNamespace: this.params.adminSecretNamespace,
          adminSecretName: this.params.adminSecretName,
          userSecretName: this.params.userSecretName,
          monitors: this.params.monitors,
          adminId: this.params.adminId,
          pool: this.params.pool,
          userId: this.params.userId,
          imageFormat: this.params.imageFormat,
          imageFeatures: this.params.imageFeatures
        }
      })
      this.reset();
      this.close();
    } catch (err) {
      Notifications.error(err);
    }

  }

  render() {
    const {...dialogProps} = this.props;
    const header = <h5><Trans>Create StorageClass</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        isOpen={AddStorageClassDialog.isOpen}
        close={this.close}
      >
        <Wizard className="AddStorageClassDialog" header={header} done={this.close}>
          <WizardStep
            contentClass="flex gaps column"
            nextLabel={<Trans>Create</Trans>}
            next={this.addStorageClass}
          >
            <SubTitle title={<Trans>Name</Trans>} />
            <Input
              required autoFocus
              placeholder={_i18n._(t`Name`)}
              value={this.name}
              onChange={(value: string) => this.name = value}
            />
            <SubTitle title={<Trans>VolumeBindingMode</Trans>} />
            <Select
              value={this.volumeBindingMode}
              options={this.volumeBindingModeOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={value => this.volumeBindingMode = value.value}
            />
            <SubTitle title={<Trans>ReclaimPolicy</Trans>} />
            <Select
              value={this.reclaimPolicy}
              options={this.reclaimPolicyOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={value => this.reclaimPolicy = value.value}
            />
            <SubTitle title={<Trans>Provisioner</Trans>} />
            <Select
              value={this.provisioner}
              options={this.provisionerOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={value => this.provisioner = value.value}
            />
            {this.provisioner == "ceph.com/rbd" ?
              <>
                <SubTitle title={<Trans>Admin Secret Namespace:</Trans>} />
                <NamespaceSelect
                  required autoFocus
                  value={this.params.adminSecretNamespace}
                  onChange={value => this.params.adminSecretNamespace = value.value} />
                <SubTitle title={<Trans>Admin Secret Name</Trans>} />
                <SecretsSelect
                  required autoFocus
                  value={this.params.adminSecretName}
                  namespace={this.params.adminSecretNamespace}
                  onChange={value => this.params.adminSecretName = value.value}
                />

                <SubTitle title={<Trans>User Secret Namespace</Trans>} />
                <NamespaceSelect
                  required autoFocus
                  value={this.userSecretNamespace}
                  onChange={value => this.userSecretNamespace = value.value} />

                <SubTitle title={<Trans>User Secret Name</Trans>} />
                <SecretsSelect
                  required autoFocus
                  value={this.params.userSecretName}
                  namespace={this.userSecretNamespace}
                  onChange={value => this.params.userSecretName = value.value}
                />
                <SubTitle title={<Trans>Monitors</Trans>} />
                <Input
                  required autoFocus
                  placeholder={_i18n._(t`Monitors`)}
                  value={this.params.monitors}
                  onChange={(value: string) => this.params.monitors = value}
                />
                <SubTitle title={<Trans>Admin ID</Trans>} />
                <Input
                  required autoFocus
                  placeholder={_i18n._(t`Admin ID`)}
                  value={this.params.adminId}
                  onChange={(value: string) => this.params.adminId = value}
                />
                <SubTitle title={<Trans>Pool</Trans>} />
                <Input
                  placeholder={_i18n._(t`Pool`)}
                  value={this.params.pool}
                  onChange={(value: string) => this.params.pool = value}
                />
                <SubTitle title={<Trans>User ID</Trans>} />
                <Input
                  placeholder={_i18n._(t`User ID`)}
                  value={this.params.userId}
                  onChange={(value: string) => this.params.userId = value}
                />
                <SubTitle title={<Trans>Image Format</Trans>} />
                <Input
                  required autoFocus
                  placeholder={_i18n._(t`ImageFormat`)}
                  value={this.params.imageFormat}
                  onChange={(value: string) => this.params.imageFormat = value}
                />
                <SubTitle title={<Trans>Image Features</Trans>} />
                <Input
                  required autoFocus
                  placeholder={_i18n._(t`ImageFeatures`)}
                  value={this.params.imageFeatures}
                  onChange={(value: string) => this.params.imageFeatures = value}
                />
              </> : <></>
            }
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}