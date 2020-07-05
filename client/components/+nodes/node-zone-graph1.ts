import "./node-zone-register-shape";
import G6 from "@antv/g6";

export class NodeZoneGraph {

    private graph: any = null;
    private width: number;
    private height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.initDrawGraphInstance();
    }
    private initDrawGraphInstance(): void {
        const data: any = {
            nodes: [

                { id: 'node1',comboId: 'rack1_s1' },
                { id: 'node2',comboId: 'rack1_s1' },
                { id: 'node1-1',comboId: 'rack1_s2' },
                { id: 'node2-2',comboId: 'rack1_s2' },
                { id: 'node1-3',comboId: 'rack1_s3' },
                { id: 'node2-4',comboId: 'rack2_s1' },
                { id: 'node1-5',comboId: 'rack2_s1' },
                { id: 'node2-6',comboId: 'rack2_s2' },
                { id: 'node1-7',comboId: 'rack2_s3' },

                { id: 'node9-0',comboId: 'rack3_s1' },
                { id: 'node9-1',comboId: 'rack3_s2' },
                { id: 'node9-2',comboId: 'rack3_s3' },

                { id: 'node9-10',comboId: 'rack4_s1' },
                { id: 'node9-11',comboId: 'rack4_s2' },
                { id: 'node9-12',comboId: 'rack4_s3' },

                // { id: 'node3',comboId: 'zone1_rack2' },
                // { id: 'node4',comboId: 'zone1_rack2' },
                // { id: 'node4-1',comboId: 'zone1_rack1_s2' },
                // { id: 'node4-2',comboId: 'zone1_rack1_s2' },
                // { id: 'node4-3',comboId: 'zone1_rack1_s2' },
                // { id: 'node4-4',comboId: 'zone1_rack1_s2' },
                // { id: 'node4-5',comboId: 'zone1_rack1_s2' },
                // { id: 'node4-6',comboId: 'zone1_rack1_s2' },
                // { id: 'node4-7',comboId: 'zone1_rack1_s2' },
                // { id: 'node4-8',comboId: 'zone1_rack1_s2' },

                // { id: 'node5',comboId: 'zone1_rack1_s3' },
                // { id: 'node6',comboId: 'zone1_rack2_s1' },

                // { id: 'node1', x: 100, y: 100, comboId: 'zone1_rack1_s1' },
                // { id: 'node2', x: 150, y: 100, comboId: 'zone1_rack1_s1' },
                // { id: 'node3', x: 200, y: 100, comboId: 'zone1_rack1_s1' },
                // { id: 'node3-1', x: 250, y: 100, comboId: 'zone1_rack1_s1' },

                // { id: 'node4', x: 100, y: 200, comboId: 'zone1_rack1_s2' },
                // { id: 'node5', x: 150, y: 200, comboId: 'zone1_rack1_s2' },

                // { id: 'node6', x: 100, y: 300, comboId: 'zone1_rack1_s3' },
                // { id: 'node7', x: 150, y: 300, comboId: 'zone1_rack1_s3' },

                // { id: 'node9', x: 100, y: 300, comboId: 'zone1_rack2_s1' },

            ],
            combos: [
                // { id: 'zone1',label: 'Zone 1' },
                // { id: 'zone1_rack1', label: 'Rack 1', collapsed: true},
                // { id: 'zone1_rack1_s1', label: 'S-1', parentId: 'zone1_rack1'},
                // { id: 'zone1_rack1_s2', label: 'S-2', parentId: 'zone1_rack1'},
                // { id: 'zone1_rack1_s3', label: 'S-3', parentId: 'zone1_rack1'},
                // { id: 'zone1_rack2', label: 'Rack 2', collapsed: true},
                //{ id: 'zone1_rack2_s1', label: 'S-1', parentId: 'zone1_rack2'},

                { id:'rack1',label:'Rack 1'},
                { id:'rack2',label:'Rack 2'},
                { id:'rack3',label:'Rack 3'},
                { id:'rack4',label:'Rack 4'},

                { id: 'rack1_s1', label: 'S-1', parentId: 'rack1'},
                { id: 'rack1_s2', label: 'S-2', parentId: 'rack1'},
                { id: 'rack1_s3', label: 'S-3', parentId: 'rack1'},

                { id: 'rack2_s1', label: 'S-1', parentId: 'rack2'},
                { id: 'rack2_s2', label: 'S-2', parentId: 'rack2'},
                { id: 'rack2_s3', label: 'S-3', parentId: 'rack2'},

                { id: 'rack3_s1', label: 'S-1', parentId: 'rack3'},
                { id: 'rack3_s2', label: 'S-2', parentId: 'rack3'},
                { id: 'rack3_s3', label: 'S-3', parentId: 'rack3'},

                { id: 'rack4_s1', label: 'S-1', parentId: 'rack4'},
                { id: 'rack4_s2', label: 'S-2', parentId: 'rack4'},
                { id: 'rack4_s3', label: 'S-3', parentId: 'rack4'},
            ]
        };

        this.graph = new G6.Graph({
            container: "node-zone-graph",
            width: 1350,
            height: 400,
            renderer: "svg",
            fitView:true,
            fitCenter:true,
            fitViewPadding:20,
            modes: {
                default: [
                  'drag-combo',
                  // 'drag-node',
                  'drag-canvas',
                  'zoom-canvas'
                ]
            },
            layout:{
                type: 'comboForce',
                // center: [ 700, 200 ],     // 可选，默认为图的中心
                linkDistance: 20,         // 可选，边长
                nodeStrength: 0.2,         // 可选
                edgeStrength: 0.1,        // 可选
                nodeSpacing:10,
                nodeSize:12,
                startAngle:3.14,
                maxIteration:100,
                comboSpacing:(d:any) => 10,
                comboPadding:(d:any) => {
                    return 1;
                },
                preventOverlap :true,
                onTick: () => {           // 可选
                  console.log('ticking');
                },
                onLayoutEnd: () => {      // 可选
                  console.log('combo force layout done');
                }
            },
            groupByTypes: false,
            defaultCombo: {
                type: 'circle',
                label:true, 
                labelCfg: {
                    refY: 10,
                    position: 'top',
                    style: {
                      fontSize: 14,
                    }
                  }
            },
            defaultNode: {
                color: '#5B8FF9',
                style: {
                  lineWidth: 2,
                  fill: '#C6E5FF',
                },
              },
            comboStateStyles: {
                dragenter: {
                    lineWidth: 4,
                    stroke: '#FE9797'
                }
            },
        });
        this.graph.data(data);
        this.graph.render();
    }
}