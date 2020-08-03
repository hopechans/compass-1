import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {observable} from "mobx";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(option: T, meta?: ActionMeta<any>): void;
}

@observer
export class AllowSubnets extends React.Component<Props> {

  @observable value: string[] = this.props.value || [];

  add = () => {
    this.value.push("");
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  render() {

    return (
      <div>
        <SubTitle
          title={
            <>
              <Trans>AllowSubnets</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        <div className="allowSubnets">
          {this.value.map((item, index) => {
            return (
              <div key={index}>
                <Grid container spacing={5}>
                  <Grid item xs={11}>
                    <Input
                      className="item"
                      required={true}
                      placeholder={_i18n._(t`CIDR`)}
                      title={this.value[index]}
                      value={this.value[index]}
                      onChange={value => {
                        this.value[index] = value
                      }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Icon
                      small
                      tooltip={<Trans>Remove Subnet</Trans>}
                      className="remove-icon"
                      material="clear"
                      onClick={(e) => {
                        this.remove(index);
                        e.stopPropagation()
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}