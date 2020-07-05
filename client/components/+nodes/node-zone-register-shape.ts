import G6 from "@antv/g6";
G6.registerCombo('cCircle', {
    drawShape: function drawShape(cfg:any, group) {
      const self = this;
      // 获取配置中的 Combo 内边距
      cfg.padding = cfg.padding || [20, 10, 20, 10];

      // 获取样式配置，style.width 与 style.height 对应 rect Combo 位置说明图中的 width 与 height
      const style = self.getShapeStyle(cfg);
      // 绘制一个矩形作为 keyShape，与 'rect' Combo 的 keyShape 一致
      const circle = group.addShape('circle', {
        attrs: {
          ...style,
          x: 0,
          y: 0,
          r: style.r
        },
        draggable: true,
        name: 'combo-keyShape'
      });

      return circle;
    },
    // 定义新增的下方 marker 的位置更新逻辑
    afterDraw:function afterDraw(cfg:any,group){
      let s = JSON.parse(JSON.stringify(cfg))
      console.log(s)
    }
  }, 'circle');

G6.registerNode(
  'self-node',
  {
    draw(cfg:any,group){
      const self = this;
      const style = self.getShapeStyle(cfg);
      let nodeColor = '#40a9ff'
      switch(cfg.status){
        case "error":
          nodeColor = "#FF6666"
          break;
        case "ready":  
          nodeColor = "#40a9ff"
          break;
      }
      const circle = group.addShape('circle', {
        attrs: {
          fill: nodeColor,
          x:style.x,
          y:style.y,
          r: style.r,
        },
        name: 'selfnode'
      });
      return circle 
    },
    afterDraw(cfg:any, group) {
      if(cfg.status != 'error'){
        // return
      }
      let nodeColor = '#40a9ff'
      switch(cfg.status){
        case "error":
          nodeColor = "#FF6666"
          break;
        case "ready":  
          nodeColor = "#40a9ff"
          break;
      }
      console.log(cfg.status,cfg)
      let r = cfg.size / 2;
      let back1 = group.addShape('circle', {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: nodeColor,
          cursor: "pointer",
          opacity: 0.6,
        },
        name: 'back1-shape',
      });
      let back2 = group.addShape('circle', {
        zIndex: -2,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: nodeColor,
          cursor: "pointer",
          opacity: 0.6,
        },
        name: 'back2-shape',
      });
      let back3 = group.addShape('circle', {
        zIndex: -1,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: nodeColor,
          cursor: "pointer",
          opacity: 0.6,
        },
        name: 'back3-shape',
      });
      group.sort(); // Sort according to the zIndex
      back1.animate(
        {
          r: r + 10,// Magnifying and disappearing
          opacity: 0.1,
        },
        {
          duration: 4000,
          // easing: 'easeCubic',
          delay: 0,
          repeat: true, // repeat
        }
      ); // no delay
      back2.animate(
        {
          r: r + 10,// Magnifying and disappearing
          opacity: 0.1,
        },
        {
          duration: 4000,
          // easing: 'easeCubic',
          delay: 1000,
          repeat: true, // repeat
        }
      ); // 1s delay
      // back3.animate(
      //   {
      //     r: r + 10,// Magnifying and disappearing
      //     opacity: 0.1
      //   }, 
      //   {
      //     duration: 4000,
      //     easing: 'easeCubic',
      //     delay: 2000,
      //     repeat: true, // repeat
      //   },
      // ); // 3s delay
    },
  },
  'circle',
);


