import G6 from "@antv/g6";
import "./node-zone-register-shape";

export class NodeZoneGraph {

    private graph: any = null;
    private width: number;
    private height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.initDrawGraphInstance();
    }

    private grapData:any = [
       {
           name:'zoneA',
           childrens:[
               {
                    name:'S-01'
               },
               {
                    name:'S-02'
               },
               {
                    name:'S-03'
                },
           ]

       }
    ]
    private initDrawGraphInstance(): void {
        const data: any = {
            nodes: [

                { id: 'node112',lable:"node1", comboId: 'rack1',status:'error'},
                { id: 'node2', lable:"node1", comboId: 'rack1' ,status:'ready',},
                { id: 'node1-1',lable:"node1",comboId: 'rack1' ,status:'ready'},
                { id: 'node2-2',lable:"node1",comboId: 'rack1' ,status:'ready'},
                { id: 'node1-3',lable:"node1",comboId: 'rack1' ,status:'ready'},
                { id: 'node2-4',comboId: 'rack2',status:'ready'},
                { id: 'node1-5',lable:"node1",comboId: 'rack2',status:'ready'},
                { id: 'node2-6',comboId: 'rack2' ,status:'ready'},
                { id: 'node1-7',comboId: 'rack2' ,status:'ready'},

                { id: 'node9-0',lable:"node1",comboId: 'rack3' ,status:'ready'},
                { id: 'node9-1',lable:"node1",comboId: 'rack3' ,status:'error'},
                { id: 'node9-2',comboId: 'rack3',status:'error'},

                { id: 'node9-10',comboId: 'rack4',status:'ready'},
                { id: 'node9-11',lable:"node1",comboId: 'rack4',status:'ready'},
                { id: 'node9-12',comboId: 'rack4',status:'error'},

                { id: 'node33',lable:"node1",comboId: 'rack5',status:'ready'},
                { id: 'node34',lable:"node1",comboId: 'rack5',status:'error'},
               
     
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

                { id:'rack1',label:'Rack 1-0'},
                { id:'rack2',label:'Rack 2-2'},
                { id:'rack3',label:'Rack 3-4'},
                { id:'rack4',label:'Rack 4-5'},

                { id:'rack5',label:'Rack 1-0'},
                // { id:'rack6',label:'Rack 2-2'},
                // { id:'rack7',label:'Rack 3-4'},
                // { id:'rack8',label:'Rack 4-5'},


            ]
        };

        this.graph = new G6.Graph({
         
            container: "node-zone-graph",
            width: 1250,
            height: 370,
            renderer: "svg",
            fitView:true,
            // fitCenter:true,
            fitViewPadding:[5,100,5,100],
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
                linkDistance: 10,         // 可选，边长
                nodeStrength: 10,         // 可选
                edgeStrength: 1,        // 可选
                nodeSpacing:10,
                maxIteration:100,
                comboSpacing:(d:any) => 50,
                comboPadding:(d:any) => 1,
                // preventOverlap :true,
                onTick: () => {           // 可选
                  console.log('ticking');
                },
                onLayoutEnd: () => {      // 可选
                  console.log('combo force layout done');
                }
            },
            groupByTypes: false,
            defaultCombo: {
                type: 'cCircle',
                label:true, 
                style:{
                    stroke:'opacity',
                    opacity:0.8,
                    fillOpacity:0.9,
                },
                labelCfg: {
                    style: {
                      fontSize: 24,
                      fill:'#666',
                      
                    }
                  }
            },
            defaultNode: {
                type:'self-node',
                // color: '#40a9ff',
                size: 20,
                //type: 'self-error-node',
               
            },
            
        });

        this.graph.data(data);
        this.graph.render();

      
       
    }
}