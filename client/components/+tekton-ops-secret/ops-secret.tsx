import {observer} from "mobx-react";
import {Secrets} from "../+config-secrets";
import { observable } from "mobx";

@observer
export class OpsSecrets extends Secrets  {
  @observable className = "OpsSecrets"
}

