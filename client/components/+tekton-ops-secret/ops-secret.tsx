import {observer} from "mobx-react";
import React from "react";
import {Secrets} from "../+config-secrets";

@observer
export class OpsSecrets extends Secrets  {
  className = "OpsSecrets"
}

