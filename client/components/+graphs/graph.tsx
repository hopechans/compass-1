import React from "react";
import { Grid, Divider, Card } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import { Button } from "../button";
import { cssNames } from "../../utils";
import { observer } from "mobx-react";
import { themeStore } from "../../theme.store";
import { observable } from "mobx";
import {
  PipelineParamsDetails,
  PipelineResourceDetails,
  PipelineParams,
  PipelineResources,
} from "../+tekton-task-detail";
import "./graph.scss";

interface IProps {
  open?: boolean;
  showSave?: boolean;
  saveCallback?: (pipeResult: PipelineResult) => void;
  closeGraph?:()=>void;
}

interface IState {
  open?: boolean;
  showSave?: boolean;
  saveCallback?: (pipeResult: PipelineResult) => void;
  closeGraph?:()=>void;
}

export interface PipelineResult {
  pipelineResources: PipelineResources[];
  pipelineParams: PipelineParams[];
}

export const pipelineResult: PipelineResult = {
  pipelineResources: [],
  pipelineParams: [],
};

@observer
export class Graph extends React.Component<IProps, IState> {
  @observable value: PipelineResult = pipelineResult;
  constructor(props: IProps) {
    super(props);
    this.state = {
      open: props.open || true,
      showSave: props.showSave || true,
      saveCallback: props.saveCallback,
    };
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      open: nextProps.open,
      showSave: nextProps.showSave,
      saveCallback: nextProps.saveCallback,
    });
  }

  handleClick = async () => {
    await this.props.saveCallback(this.value);
  };

  closeGraph = () => {
    this.props.closeGraph();
  };

  render() {
    const { open, showSave } = this.state;
    return (
      <div>
        <div hidden={open}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <h5 className="title">
                <Trans>Pipeline Visualization</Trans>
              </h5>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}></Grid>
            <Grid item xs={3} className="btn-group">
              <Button primary onClick={this.handleClick} hidden={showSave}>
                <span>Save</span>
              </Button>

              <Button onClick={this.closeGraph} style={{marginLeft:'10px'}}>
                <span>Close</span>
              </Button>
            </Grid>
          </Grid>
        </div>

        <div className="pipeline-graph" id="pipeline-graph" hidden={open}></div>
      </div>
    );
  }
}

