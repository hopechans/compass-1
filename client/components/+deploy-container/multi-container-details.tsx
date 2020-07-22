import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {Button} from "../button";
import {Collapse} from "../collapse";
import {Popconfirm} from "antd";
import {ContainerDetails} from "./container-details";
import {observable} from "mobx";
import {DeleteOutlined} from '@ant-design/icons';
import {container, Container} from "./common";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";


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
          <Popconfirm
            title={_i18n._(`Confirm Delete?`)}
            onConfirm={(event: any) => {
              event.preventDefault();
              event.stopPropagation();
              this.remove(index);
            }}
            onCancel={(event: any) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            okText={_i18n._(`Yes`)}
            cancelText={_i18n._(`No`)}>
            <DeleteOutlined
              translate={"yes"}
              style={{color: '#ff4d4f'}}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </Popconfirm>
        )
      }
      return (<></>)
    }

    return (
      <>
        <Button primary onClick={() => this.add()}><span>{_i18n._(t`Addition Container`)}</span></Button>
        <br/><br/>
        {this.value.map((item, index) => {
          return (
            <Collapse panelName={<Trans>Container</Trans>} extraExpand={genExtra(index)}>
              <ContainerDetails
                base={true}
                commands={true}
                args={true}
                environment={true}
                readyProbe={true}
                liveProbe={true}
                lifeCycle={true}
                divider={true}
                volumeMounts={true}
                value={this.value[index]}
                onChange={(value: any) => {
                  this.value[index] = value
                }}
              />
            </Collapse>
          )
        })}
      </>
    )
  }
}