import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Popconfirm} from "antd";
import {Collapse} from "../collapse";
import {Button} from "../button";
import {DeleteOutlined} from '@ant-design/icons';
import {RuleDetails} from "./rule-details";
import {Rule, rule} from "./common";
import {_i18n} from "../../i18n";
import {Trans} from "@lingui/macro";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class MultiRuleDetails extends React.Component<Props> {

  @observable value: Rule[] = this.props.value || []

  add() {
    this.value.push(rule)
  }

  remove = (index: number) => {
    this.value.splice(index, 1)
  }

  render() {

    const genExtra = (index: number) => {
      return (
        <Popconfirm
          title={_i18n._("Confirm Delete?")}
          onConfirm={(event: any) => {
            this.remove(index);
            event.stopPropagation();
          }}
          onCancel={(event: any) => {
            event.stopPropagation();
          }}
          okText={_i18n._("Yes")}
          cancelText={_i18n._("No")}
        >
          <DeleteOutlined
            translate={"yes"}
            style={{color: "#ff4d4f"}}
            onClick={(event: any) => {
              event.stopPropagation();
            }}
          />
        </Popconfirm>
      );
    }

    return (
      <div>
        <Button primary onClick={() => this.add()}>
          <span>{_i18n._("Add Rule")}</span>
        </Button>
        <br/>
        <br/>
        {this.value.length > 0 ?
          this.value.map((item, index) => {
            return (
              <Collapse panelName={<Trans>Rule</Trans>} extraExpand={genExtra(index)}>
                <RuleDetails value={this.value[index]} onChange={value => this.value[index] = value}/>
              </Collapse>
            );
          }):<></>
        }
      </div>
    )
  }
}