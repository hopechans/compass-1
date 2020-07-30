import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {Button} from "../button";
import {Collapse} from "../collapse";
import {ContainerDetails} from "./container-details";
import {observable} from "mobx";
import {container, Container} from "./common";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Icon} from "../icon";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(option: T, meta?: ActionMeta<any>): void;

  base?: boolean;
  commands?: boolean;
  args?: boolean;
  environment?: boolean;
  readyProbe?: boolean;
  liveProbe?: boolean;
  lifeCycle?: boolean;
  divider?: true;
}

@observer
export class MultiContainerDetails extends React.Component<Props> {

  static defaultProps = {
    base: true,
    commands: true,
    args: true,
    environment: true,
    readyProbe: true,
    liveProbe: true,
    lifeCycle: true,
    divider: true,
    volumeClaims: true,
  }

  @observable value: Container[] = this.props.value || [container];

  add() {
    this.value.push(container);
  }

  remove(index: number) {
    this.value.splice(index, 1)
  }

  render() {

    const genExtra = (index: number) => {
      if (this.value.length > 1) {
        return (
          <Icon
            material={"delete_outline"}
            style={{color: '#ff4d4f'}}
            onClick={(event) => {
              this.remove(index);
              event.preventDefault();
              event.stopPropagation();
            }}
          />
        )
      }
      return (null)
    }

    return (
      <div>
        <Button primary onClick={() => this.add()}><span>{_i18n._(t`Add Container`)}</span></Button>
        <br/><br/>
        {this.value.map((item, index) => {
          return (
            <Collapse panelName={<Trans>Container</Trans>} extraExpand={genExtra(index)} key={"container" + index}>
              <ContainerDetails
                base={true}
                commands={true}
                args={true}
                environment={true}
                readyProbe={true}
                liveProbe={true}
                lifeCycle={true}
                volumeMounts={true}
                value={this.value[index]}
                onChange={(value: any) => {
                  this.value[index] = value
                }}
              />
            </Collapse>
          )
        })}
      </div>
    )
  }
}