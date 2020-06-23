import "./config-storageclass-dialog.scss"

import React from "react";
import {Dialog, DialogProps} from "../dialog";
import {t, Trans} from "@lingui/macro";
import {Wizard, WizardStep} from "../wizard";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {storageClassStore} from "./storage-class.store";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {Select, SelectOption} from "../select";
import {Icon} from "../icon";
import {SubTitle} from "../layout/sub-title";
import {cephParams, CephParams} from "./common";
import {SecretsSelect} from "../+config-secrets/secrets-select";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {Notifications} from "../notifications";
import {StorageClass} from "../../api/endpoints";

interface Props extends DialogProps {
}

@observer
export class ConfigStorageClassDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static data: StorageClass;
  @observable name: string = "";
  @observable provisioner: string = "ceph.com/rbd";
  @observable volumeBindingMode: string = "Immediate";
  @observable reclaimPolicy: string = "Delete";
  @observable params: CephParams = cephParams;

  static open(data: StorageClass) {
    ConfigStorageClassDialog.isOpen = true;
    ConfigStorageClassDialog.data = data;
  }

  static close() {
    ConfigStorageClassDialog.isOpen = false;
  }

  close = () => {
    ConfigStorageClassDialog.close();
  }

  formatOptionLabel = (option: SelectOption) => {
    const {value, label} = option;
    return label || (
      <>
        <Icon small material="layers"/>
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
      "Delete"
    ]
  }

  get fsTypeOptions() {
    return [
      "ext4"
    ]
  }

  get imageFormatOptions() {
    return [
      "1",
      "2",
      "3",
      "4",
      "5"
    ]
  }

  get imageFeaturesOptions() {
    return [
      "layering",
    ]
  }

  onOpen = () => {
    this.name = ConfigStorageClassDialog.data.getName();
    this.provisioner = ConfigStorageClassDialog.data.provisioner;
    this.volumeBindingMode = ConfigStorageClassDialog.data.volumeBindingMode;
    this.reclaimPolicy = ConfigStorageClassDialog.data.reclaimPolicy;
    this.params.adminSecretNamespace = ConfigStorageClassDialog.data.parameters.adminSecretNamespace;
    this.params.adminSecretName = ConfigStorageClassDialog.data.parameters.adminSecretName;
    this.params.userSecretNamespace = ConfigStorageClassDialog.data.parameters.userSecretNamespace;
    this.params.userSecretName = ConfigStorageClassDialog.data.parameters.userSecretName;
    this.params.monitors = ConfigStorageClassDialog.data.parameters.monitors;
    this.params.adminId = ConfigStorageClassDialog.data.parameters.adminId;
    this.params.pool = ConfigStorageClassDialog.data.parameters.pool;
    this.params.userId = ConfigStorageClassDialog.data.parameters.userId;
    this.params.fsType = ConfigStorageClassDialog.data.parameters.fsType;
    this.params.imageFormat = ConfigStorageClassDialog.data.parameters.imageFormat;
    this.params.imageFeatures = ConfigStorageClassDialog.data.parameters.imageFeatures
  }

  updateStorageClass = async () => {

    try {
      await storageClassStore.create({name: this.name, namespace: ''}, {
        provisioner: this.provisioner,
        volumeBindingMode: this.volumeBindingMode,
        reclaimPolicy: this.reclaimPolicy,
        parameters: {
          adminSecretNamespace: this.params.adminSecretNamespace,
          adminSecretName: this.params.adminSecretName,
          userSecretNamespace: this.params.userSecretNamespace,
          userSecretName: this.params.userSecretName,
          monitors: this.params.monitors,
          adminId: this.params.adminId,
          pool: this.params.pool,
          userId: this.params.userId,
          fsType: this.params.fsType,
          imageFormat: this.params.imageFormat,
          imageFeatures: this.params.imageFeatures
        }
      })
      this.close();
    } catch (err) {
      Notifications.error(err);
    }

  }

  render() {
    const {...dialogProps} = this.props;
    const header = <h5><Trans>Update StorageClass</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        isOpen={ConfigStorageClassDialog.isOpen}
        onOpen={this.onOpen}
        close={this.close}
      >
        <Wizard className="ConfigStorageClassDialog" header={header} done={this.close}>
          <WizardStep
            contentClass="flex gaps column"
            nextLabel={<Trans>Apply</Trans>}
            next={this.updateStorageClass}
          >
            <SubTitle title={<Trans>Name</Trans>}/>
            <Input
              required autoFocus
              placeholder={_i18n._(t`Name`)}
              value={this.name}
              onChange={(value: string) => this.name = value}
            />
            <SubTitle title={<Trans>VolumeBindingMode</Trans>}/>
            <Select
              value={this.volumeBindingMode}
              options={this.volumeBindingModeOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={value => this.volumeBindingMode = value.value}
            />
            <SubTitle title={<Trans>ReclaimPolicy</Trans>}/>
            <Select
              value={this.reclaimPolicy}
              options={this.reclaimPolicyOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={value => this.reclaimPolicy = value.value}
            />
            <SubTitle title={<Trans>Provisioner</Trans>}/>
            <Select
              value={this.provisioner}
              options={this.provisionerOptions}
              formatOptionLabel={this.formatOptionLabel}
              onChange={value => this.provisioner = value.value}
            />
            {this.provisioner == "ceph.com/rbd" ?
              <>
                <SubTitle title={<Trans>Admin Secret Namespace:</Trans>}/>
                <NamespaceSelect
                  required autoFocus
                  value={this.params.adminSecretNamespace}
                  onChange={value => this.params.adminSecretNamespace = value.value}/>
                <SubTitle title={<Trans>Admin Secret Name</Trans>}/>
                <SecretsSelect
                  required autoFocus
                  value={this.params.adminSecretName}
                  namespace={this.params.adminSecretNamespace}
                  onChange={value => this.params.adminSecretName = value.value}
                />
                <SubTitle title={<Trans>User Secret Namespace:</Trans>}/>
                <NamespaceSelect
                  required autoFocus
                  value={this.params.userSecretNamespace}
                  onChange={value => this.params.userSecretNamespace = value.value}/>
                <SubTitle title={<Trans>User Secret Name</Trans>}/>
                <SecretsSelect
                  required autoFocus
                  value={this.params.userSecretName}
                  namespace={this.params.userSecretNamespace}
                  onChange={value => this.params.userSecretName = value.value}
                />
                <SubTitle title={<Trans>Monitors</Trans>}/>
                <Input
                  required autoFocus
                  placeholder={_i18n._(t`Monitors`)}
                  value={this.params.monitors}
                  onChange={(value: string) => this.params.monitors = value}
                />
                <SubTitle title={<Trans>Admin Id</Trans>}/>
                <Input
                  required autoFocus
                  placeholder={_i18n._(t`Admin Id`)}
                  value={this.params.adminId}
                  onChange={(value: string) => this.params.adminId = value}
                />
                <SubTitle title={<Trans>Pool</Trans>}/>
                <Input
                  placeholder={_i18n._(t`Pool`)}
                  value={this.params.pool}
                  onChange={(value: string) => this.params.pool = value}
                />
                <SubTitle title={<Trans>User Id</Trans>}/>
                <Input
                  placeholder={_i18n._(t`UserId`)}
                  value={this.params.userId}
                  onChange={(value: string) => this.params.userId = value}
                />
                <SubTitle title={<Trans>FileSystem Type</Trans>}/>
                <Select
                  options={this.fsTypeOptions}
                  value={this.params.fsType}
                  onChange={value => this.params.fsType = value.value}/>
                <SubTitle title={<Trans>Image Format</Trans>}/>
                <Select
                  options={this.imageFormatOptions}
                  value={this.params.imageFormat}
                  onChange={value => this.params.imageFormat = value.value}/>
                <SubTitle title={<Trans>Image Features</Trans>}/>
                <Select
                  options={this.imageFeaturesOptions}
                  value={this.params.imageFeatures}
                  onChange={value => this.params.imageFeatures = value.value}/>
              </> : <></>
            }
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}