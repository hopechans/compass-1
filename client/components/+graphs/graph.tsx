
import React from "react";
import { Grid, Divider } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import { Button } from "../button";



interface IProps {
    open?: boolean;
    showSave?: boolean;
    saveCallback?: () => void;
}

interface IState {
    open?: boolean;
    showSave?: boolean;
    saveCallback?: () => void;
}


export class Graph extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            open: props.open || true,
            showSave: props.showSave || true,
            saveCallback: props.saveCallback,
        }
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({
            open: nextProps.open,
            showSave: nextProps.showSave,
            saveCallback: nextProps.saveCallback,
        });
    }

    handleClick = () => { this.props.saveCallback(); };


    render() {
        const { open, showSave } = this.state;

        return (
            <div>

                <div hidden={
                    open
                }>
                    <Grid container spacing={1}>

                        <Grid item xs={3}>
                            <h5 className="title">
                                <Trans>Pipeline Visualization</Trans>
                            </h5>
                        </Grid>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={5}></Grid>
                        <Grid item xs="auto">
                            <Button primary onClick={this.handleClick} hidden={showSave}>
                                <span>Save</span>
                            </Button>
                        </Grid>
                    </Grid>
                </div>

                <div
                    className="pipeline-graph"
                    id="pipeline-graph"
                    hidden={
                        open
                    }
                >


                </div>
            </div>
        )
    }
}