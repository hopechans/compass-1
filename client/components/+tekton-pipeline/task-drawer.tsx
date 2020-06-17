import React from "react";
import { observer } from "mobx-react";
import { observable, action, computed } from "mobx";
import { Trans } from "@lingui/macro";
import { DrawerItem } from "../drawer";
import { Drawer } from "../drawer";
import "./registerShape";
import { Icon } from "../icon";
import { Select } from "../select";
import { _i18n } from "../../i18n";
import { Grid, Divider } from "@material-ui/core";
import { Step, StepUp, stepUp } from "./steps";
import { Input } from "../input";
import { Button } from "../button";
import { ActionMeta } from "react-select/src/types";




interface Props<T = any> extends Partial<Props> {
    value?: T;
    f?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(option: T, meta?: ActionMeta): void;
}


export interface TaskDrawerEntity {
    taskDrawer?: boolean,
    taskName?: string,
    graph?: any,
    currentNode?: any,
    addParams?: string[],
    addResources?: string[],
    currentSelectResource?: string[],
    selectResource?: string[],
    defaultresourceType?: string[],
    currentSelectResourceType?: string,
    step?: StepUp[],
    addVolumes?: string[],
}

export const taskDrawerEntity: TaskDrawerEntity = {
    taskDrawer: false,
    taskName: "task",
    graph: null,
    currentNode: null,
    addParams: [],
    addResources: [],
    currentSelectResource: [],
    selectResource: [],
    defaultresourceType: [],
    currentSelectResourceType: "",
    step: [],
    addVolumes: [],
}



@observer
export class TaskDrawer extends React.Component<Props> {
    @observable value: TaskDrawerEntity = this.props.value || taskDrawerEntity;
    @observable static taskDrawer = false;

    static open() {
        setTimeout(() => {
            TaskDrawer.taskDrawer = true;
        })
    }

    static close() {
        TaskDrawer.taskDrawer = false;
    }

    handleSelectRepo = (e: any) => {
        e.stopPropagation();
    };

    handleTaskName = (e: any) => {
        this.value.taskName = e;
        this.value.graph.setItemState(this.value.currentNode, "click", this.value.taskName);
    };

    addParam = () => {
        this.value.addParams.push("");
    };

    removeParam = (index: number) => {
        this.value.addParams.splice(index, 1);
    };

    addResource = () => {
        this.value.addResources.push("");
    };

    removeResource = (index: number) => {
        this.value.addResources.splice(index, 1);
    };

    addVolume = () => {
        this.value.addVolumes.push("");
    };

    removeVolume = (index: number) => {
        this.value.addVolumes.splice(index, 1);
    };

    renderVolumeHeader = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                    <Divider />
                    <Icon
                        small
                        tooltip={"resource"}
                        material="add_circle_outline"
                        onClick={(e) => {
                            this.addVolume();
                            e.stopPropagation();
                        }}
                    />
                    <b> Add Pipeline Volume:</b>
                </Grid>
                <Grid item xs={5}>
                    <Trans>Name</Trans>
                </Grid>
                <Grid item xs={5}>
                    <Trans>ResourceType</Trans>
                </Grid>
            </Grid>
        );
    };

    renderResourceHeader = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                    <Divider />
                    <Icon
                        small
                        tooltip={"resource"}
                        material="add_circle_outline"
                        onClick={(e) => {
                            this.addResource();
                            e.stopPropagation();
                        }}
                    />
                    <b> Add Pipeline Resources:</b>
                </Grid>
                <Grid item xs={5}>
                    <Trans>Name</Trans>
                </Grid>
                <Grid item xs={5}>
                    <Trans>ResourceType</Trans>
                </Grid>
            </Grid>
        );
    };

    renderInputs() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}></Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={3}>
                    <Icon
                        small
                        tooltip={"inputs"}
                        material="add_circle_outline"
                        onClick={(e) => {
                            this.addResource();
                            e.stopPropagation();
                        }}
                    />
                    <b> Add Pipeline Inputs:</b>
                </Grid>
            </Grid>
        );
    }

    renderResource() {
        return (
            <div className="Resource">
                {this.renderResourceHeader()}
                {this.value.addResources.map((item, index) => {
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={5}>
                                <Select
                                    value={this.value.currentSelectResource}
                                    options={this.value.selectResource}
                                ></Select>
                            </Grid>
                            <Grid item xs={5}>
                                <Select
                                    value={this.value.currentSelectResourceType}
                                    options={this.value.defaultresourceType}
                                ></Select>
                            </Grid>
                            <Grid item xs={1}>
                                <Icon
                                    small
                                    material="remove_circle_outline"
                                    onClick={(e) => {
                                        this.removeResource(index);
                                        e.stopPropagation();
                                    }}
                                />
                            </Grid>
                        </Grid>
                    );
                })}
            </div>
        );
    }

    renderParamsHeader() {
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12}>
                        <Icon
                            small
                            tooltip={"Params"}
                            material="add_circle_outline"
                            onClick={(e) => {
                                this.addParam();
                                e.stopPropagation();
                            }}
                        />

                        <b> Add Pipeline Params:</b>
                    </Grid>
                    <Grid item xs={3}>
                        <Trans>Name</Trans>
                    </Grid>
                    <Grid item xs={3}>
                        <Trans>Type</Trans>
                    </Grid>
                    <Grid item xs={3}>
                        <Trans>Description</Trans>
                    </Grid>
                    <Grid item xs={3}>
                        <Trans>Default</Trans>
                    </Grid>
                </Grid>
            </div>
        );
    }

    renderParams() {
        return (
            <div className="params">
                {this.renderParamsHeader()}

                {this.value.addParams.map((item, index) => {
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Input />
                            </Grid>
                            <Grid item xs={3}>
                                <Input />
                            </Grid>
                            <Grid item xs={3}>
                                <Input />
                            </Grid>
                            <Grid item xs={2}>
                                <Input />
                            </Grid>
                            <Grid item xs={1}>
                                <Icon
                                    small
                                    material="remove_circle_outline"
                                    onClick={(e) => {
                                        this.removeParam(index);
                                        e.stopPropagation();
                                    }}
                                />
                            </Grid>
                        </Grid>
                    );
                })}
            </div>
        );
    }

    render() {
        return (
            <Drawer
                className="flex column"
                open={!!TaskDrawer.taskDrawer}
                title="Task Detail"
                onClose={TaskDrawer.close}
            >
                <div className="taskName">
                    <DrawerItem name={<b>Task Name:</b>}>
                        <Input
                            placeholder={"Task Name"}
                            value={this.value.taskName}
                            onChange={(e: any) => {
                                this.handleTaskName(e);
                            }}
                        />
                    </DrawerItem>

                    {this.renderParams()}
                    {this.renderResource()}
                    <Divider />
                    <br />
                    <Step value={this.value.step} onChange={(v) => this.value.step = v} />
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item xs={11}>
                        </Grid>
                        <Grid item xs={1}>
                            <Button primary onClick={(e) => {
                                this.props.onChange(this.value.currentNode._cfg.id);
                            }}>
                                <span>Save</span>
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Drawer>
        );
    }

}