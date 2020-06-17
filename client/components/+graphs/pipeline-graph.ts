import "./register-shape";
import G6 from "@antv/g6";



export class PipelineGraph {

    private graph: any = null;
    private width: number;
    private height: number;


    public getGraph(): any {
        return this.graph;
    }

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.initDrawGraphInstance();
    }



    public setItemState(name: string, value: any, item: any): void {
        this.graph.setItemState(name, value, item);
    }

    public setNodeStatusToSucceed(node: any): void {
        this.setItemState("succeed", "", node);
    }


    public setNodeStatusToFailed(node: any): void {
        this.setItemState("failed", "", node);
    }

    public setNodeStatusToPending(node: any): void {
        this.setItemState("pending", "", node);
    }

    public setNodeStatusToCancel(node: any): void {
        this.setItemState("cancel", "", node);
    }


    public bindClickOnNode(callback: () => any): void {

        var index = 0;
        this.graph.on("node:click", (evt: any) => {
            const { item } = evt;
            const shape = evt.target.cfg.name;

            if (shape === "right-plus") {
                const source = item._cfg.id;
                const target = Number(source) + 1;

                const model = item.getModel();
                const { x, y } = model;
                const point = this.graph.getCanvasByPoint(x, y);
                this.graph.addItem("node", {
                    id: target.toString(),
                    buildName: "task" + target,
                    x: Number(point.x) + 300,
                    y: Number(point.y),
                    anchorPoints: [
                        [0, 0.5],
                        [1, 0.5],
                    ],
                });

                this.graph.addItem("edge", {
                    source: target.toString(),
                    target: model.id,
                });

                return;
            }

            if (shape === "bottom-plus") {
                const source = item._cfg.id;
                const target = Number(source) + 10;

                const model = item.getModel();
                const { x, y } = model;
                const point = this.graph.getCanvasByPoint(x, y);
                this.graph.addItem("node", {
                    buildName: "task" + target,
                    id: target.toString(),
                    x: Number(point.x),
                    y: Number(point.y) + 80,
                    anchorPoints: [
                        [0, 0.5],
                        [1, 0.5],
                    ],
                });

                this.graph.addItem("edge", {
                    type: "hvh",
                    source: target.toString(),
                    target: model.id,
                });
                return;
            }
            callback();
        });
    }

    public setTaskName(taskName: string, node: any): void {
        this.graph.setItemState(node, "click", taskName);
    }

    public bindMouseenter(): void {
        // 监听鼠标进入节点事件
        this.graph.on("node:mouseenter", (evt: { item: any }) => {

            const node = evt.item;
            // 激活该节点的 hover 状态
            this.graph.setItemState(node, "hover", true);
        });
    }

    public bindMouseleave(): void {
        // 监听鼠标离开节点事件
        this.graph.on("node:mouseleave", (evt: { item: any }) => {
            const node = evt.item;
            // 关闭该节点的 hover 状态
            this.graph.setItemState(node, "hover", false);
        });
    }


    private initDrawGraphInstance(): void {

        const data: any = {
            nodes: [
                {
                    id: "1",
                    x: 0,
                    y: 0,
                    taskName: "task1",
                    anchorPoints: [
                        [0, 0.5],
                        [1, 0.5],
                    ],
                },
            ],
        };

        this.graph = new G6.Graph({
            container: "container",
            width: 1150,
            height: 305,
            renderer: "svg",
            // layout: {
            //   type: "dagre",
            //   rankdir: 'LR',
            //   align: 'DL',
            //   controlPoints: true
            // },
            modes: {
                default: [
                    "drag-node",
                    {
                        type: "tooltip",
                        formatText: function formatText(model) {
                            const text = "container: test,duration: 5min";
                            return text;
                        },
                        // offset: 30
                    },
                ],

                //   edit: ['click-select'],
                // addEdge: ['click-add-edge', 'click-select'],
            },
            defaultEdge: {
                type: "Line",
                style: {
                    stroke: "#959DA5",
                    lineWidth: 4,
                },
                // 其他配置
            },
            defaultNode: {
                type: "card-node",
                size: [120, 40],
                linkPoints: {
                    left: true,
                    right: true,
                    size: 5,
                },
            },
            nodeStateStyles: {
                hover: {
                    fillOpacity: 0.1,
                    lineWidth: 2,
                },
            },
        });


        this.graph.data(data);
        this.graph.setMode("addEdge");
        this.graph.render();

    }
}