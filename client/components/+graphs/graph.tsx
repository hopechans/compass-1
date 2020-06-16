
import React from "react";
import { Grid, Divider } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import { Button } from "../button";



interface IProps {
    open?: boolean;
}

interface IState {
    open?: boolean;
}


export class Graph extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            open: props.open || true,
        }
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({
            open: nextProps.open,
        });
    }


    render() {
        const { open } = this.state;

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
                        <Grid item xs={3}></Grid>
                        <Grid item xs="auto">
                            <Button primary onClick={() => console.log("test")}>
                                <span>Run</span>
                            </Button>
                        </Grid>
                        <Grid item xs="auto">
                            <Button primary onClick={() => console.log("test")}>
                                <span>ReRun</span>
                            </Button>
                        </Grid>
                        <Grid item xs="auto">
                            <Button primary onClick={() => console.log("test")}>
                                <span>Cancel</span>
                            </Button>
                        </Grid>
                    </Grid>
                </div>

                <div
                    className="graph"
                    id="container"
                    hidden={
                        open
                    }
                >


                </div>
            </div>
        )
    }
}