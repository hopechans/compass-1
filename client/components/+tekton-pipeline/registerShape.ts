import G6 from '@antv/g6'


const Util = G6.Util;
G6.registerNode('pipeline-node', {
  draw(cfg: any, group: any) {
    const r = 7;
    const rect = group.addShape('rect', {
      attrs: {
        fill: 'lightblue',
        stroke: '#888',
        lineWidth: 1,
        radius: 7,
        width: 80,
        height: 35,
        top: true,
      },
      draggable: true,
    });

    const textConfig = {
      textAlign: 'left',
      textBaseline: 'top',
    };

    // let logoContainer = $('<div class="logo-container"></div>');
    // let select = `
   
    // `
    // logoContainer.append(select);
    // logoContainer.find('.selectBox').on('click',function(){
    //   alert("aaaaaaaaaaaaaaaaaaa");
    // });
    
    // group.addShape('dom', {
    //   name:'test',
    //   attrs: {
    //     ...textConfig,
    //     width: 120,
    //     height: 40,
    //     x: 10,
    //     y: 5,
    //     html: `
    //     <select id="selectBox">
    //     <option value="grapefruit">task1</option>
    //     <option value="lime">task2</option>
    //     <option value="coconut">task3</option>
    //     <option value="mango">task4</option> 
    //   </select>
    //     `,
    //   },
    // });

      group.addShape('text', {
      attrs: {
        ...textConfig,
        x: 20,
        y: 15,
        text: "task1",
        fontSize: 10,
        fill: '#000',
        cursor: 'pointer',
        isTitleShape: true,
      },
    });

   
    
    return rect;
  },


  setState(name: any, value: any, item: any) {
    if (name === 'hover' && value) {
      const group = item.getContainer();
      const lightColor = 'lightblue';
      const collapsed = true;
      const rectConfig = {
        width: 80,
        height: 35,
        lineWidth: 1,
        fontSize: 12,
        fill: '#fff',
        radius: 24,
        stroke: lightColor,
        opacity: 1,
      };

      group.addShape('circle', {
        name: 'test',
        attrs: {
          x: rectConfig.width + 9,
          y: rectConfig.height / 2,
          r: 8,
          stroke: lightColor,
          fill: collapsed ? lightColor : '',
          isCollapseShape: true,
        },
      });

      group.addShape('text', {
        name: 'right-plus',
        attrs: {
          x: rectConfig.width + 9,
          y: rectConfig.height / 2,
          width: 20,
          height: 20,
          textAlign: 'center',
          textBaseline: 'middle',
          text: collapsed ? '+' : '-',
          fontSize: 10,
          fill: collapsed ? '#00000' : lightColor,
          cursor: 'pointer',
          isCollapseShape: true,
        },
      });

      setTimeout(() => {
        const shape = group.get('children');
        group.removeChild(group.get('children')[shape.length - 2]);
        group.removeChild(group.get('children')[shape.length - 1]);
      }, 1000);


      group.addShape('circle', {
        name: 'test',
        attrs: {
          x: rectConfig.width / 2,
          y: rectConfig.height + 9,
          r: 8,
          stroke: lightColor,
          fill: collapsed ? lightColor : '',
          isCollapseShape: true,
        },
      });
      group.addShape('text', {
        name: 'bottom-plus',
        attrs: {
          x: rectConfig.width / 2,
          y: rectConfig.height + 9,
          width: 16,
          height: 16,
          textAlign: 'center',
          textBaseline: 'middle',
          text: collapsed ? '+' : '-',
          fontSize: 10,
          fill: collapsed ? '#00000' : lightColor,
          cursor: 'pointer',
          isCollapseShape: true,
        },
      });

      setTimeout(() => {
        const shape = group.get('children');
        group.removeChild(group.get('children')[shape.length - 2]);
        group.removeChild(group.get('children')[shape.length - 1]);
      }, 1000);


    }
  },

  getAnchorPoints() {
    return [
      [0.5, 0.5]
    ]
  },

  afterDraw(cfg, group) {
    const size = [25, 50];
    const width = size[0] - 12;
    const height = size[1] - 12;
    const image = group.addShape('image', {
      attrs: {
        x: -width / 2,
        y: -height / 2,
        width,
        height,
        img: 'data:image/webp;base64,UklGRq4FAABXRUJQVlA4IKIFAABwHwCdASo8ADwAPiEMhEGhhv6rQAYAgS2NHsdCq/4D8AOoA64OEUAj/XPxVwyvRGvyO/gGxN/t3oK/1X6zesX3L/p/RP/2HCgKAB9AGeAbCB+AGwAbQBtA/8c/m/4PYHTonm+SzRH6B9sv2i/rOZC+G/ln9l/ML/GdoD7APcA/TD+09QDzAfrX+vHYM9AD+Uf0zrAPQA/bH0vv2t+CH9qf2R+A39e6X098/I7IAcLcs8Gjmc/9T7gPbX9H+wJ+rPVV9En9ZmBI5oUiYhkYHIVjRr9hzCTPcV5Rs/wjjIHkxPgtr/3ALZSuUm146HHwqQVA23hnnqH/4aJ/k4v4hU6RBZ0AAAD+//8ARPyL9yWIlAbWBAD0oKSqlYWreuRa3Oj02u+TvSQS8iwMYewUYTWLDNp9wOlFJaWnqE+za35UwUXuDAT6T0I4fwY+u+qrRVhl+S1ir4X7BQiNswug5AX+MjQcXEeUwfSIEUT+DFPCr+BUiwTbFxLni7fv61vRbmXoauLz4tiqOFTzEGP8tNXP5+H7mZVGfNjIxapT3FGUtqBdp/SD5cTOYOkn2fawkpqpCSqf2+CfiGWtIF673fEzlk/hIbWDhQ81C/ddxLn609d/5efckbdZ8HZbhhVmM82/Uat7CFmw1SH5xCxRxEEhjpf1EP1Xn5q9VZfm1+OFTab/MN67Xha8K//5oVBlMgZALE653X0fas/+2xMqiyCu5Wa7PHsCwbBwqROfNmzi4LPOTjkFPHVKDD1Nfj4/sul6cANdF68rf2jszlyZsUUoLTP7H3swSroc3ssNXSRVAcYd7+iBZpfoAYWvKgnr+Hv62fHZX5ZbjYbYzVjq6fsXkubto858NuUx4+ILb5y7dP6W3/IYVeUSF0yZseKIZhOMs9BBf5uB2Y3Ott//+1OG7hYINzcqigrzWAOJbSmVw3G0ULywkobx+rvfk8VmZFzQGgP/+4T74mp/vsZyM1NLguiTO2gNO05tcpXwveq5mrcweXrJ/bRZDmU2KBrnXhkXq+735c+UHTFq4h4jMOPm5shKioB6XaqhUf3DJlMg8937g/SKjrgD0H5sNm0/k4FfilBbcrsjc3dd6cwEYJo3CNhe3SpNJ2geNXyV4/hq/BZXZ1kiVknjmf5cUx7Tv/9Sb+fQ/DgAsRNSz1wiVodiLjP7aVrkxbWx5gJ8U/j0o1Ipm/nyDZRPrQXmbPAcy1eDDejxTDBKe42ElHpC2QlFdhOedsp4i9QVjt8EqWGy1YzPaGqZhCVg/LWt8/+4BmiCzNGtpR21MGJf4kI/n/1sbe36e1QBCBAx4EVfTM82ZM2lh0P189e7eY0A3NzXWVrUek8SEn+DYYCQeEaC5hDHGreFHT1baY6KyrFx3G9oMm3fLrCqmNjFRnZa3LB/5m8FgCpq9B/1OCLRE5GzVTZnVzj/4V38PgCIpX16Kznijf01+MkDeS9oCF2hEXQ9tr+mPLrjGy4Cg5fyLgyCj1fUq33nMf79Svli2h83m3gqkoxJcXvBetFQP8V/gRjBNGmFXK5TfwLhbolWEjDqUGK3n+hxzQLif9zreYO88EIRTUNbzE1/Sn7rBEtjB0uawNje5OubWsB62SOlMZoZpxrDbMb4UvQrODPhSafmhcYe9zm/dHxssMfUthhDKjyMhoRhngPjbzfGXmIV2Omgrn/zbefK/PawUGSH6x4Qk4HCN4/X8S+XCf51JJtOQeHST/yfwg69uMkE07SONnhGUrL6j5oQn6JI+zkaH/H/P/Ti/pfOTfAWxQNiMvWX08mqbuUweFSQ/G5YUP/uCvZAXutf1+Nhl2jj/n4/fPOihPjwvfFnnjOaQvs9PSpF33d+396LASZ3IID/4UP4pf9eOMXw82ccoUUUHX6MfBWyBDvARCrdPmerUwKwW+lBIAe1dsAAAA==',
        label: 'Image Rotate',
      },
      name: 'image-shape',
    });
    image.animate(
        (      ratio: number) => {
        const matrix = Util.mat3.create();
        const toMatrix = Util.transform(matrix, [['r', ratio * Math.PI * 2]]);
        return {
          matrix: toMatrix,
        };
      },
      {
        repeat: true,
        duration: 300,
        easing: 'easeCubic',
      },
    );
  },
},

  'single-node'
);


G6.registerEdge('line-arrow', {
  options: {
    style: {
      stroke: '#ccc',
    },
  },
  draw(cfg: any, group: any) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;

    const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;
    const startArrow = (cfg.style && cfg.style.startArrow) || undefined;
    const endArrow = (cfg.style && cfg.style.endArrow) || undefined;

    const keyShape = group.addShape('path', {
      attrs: {
        path: [
          ['M', startPoint.x, startPoint.y],
          // ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
          ['L', endPoint.x, endPoint.y],
        ],
        stroke,
        lineWidth: 1,
        startArrow,
        endArrow
      },
      className: 'edge-shape',
      name: 'edge-shape',
    },'cubic');
    return keyShape;
  },
},'cubic-horizontal');



G6.registerEdge('hvh', {
  draw(cfg, group) {
    return this.drawShape(cfg, group);
  },  
  drawShape(cfg: any, group) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;

    const shape = group.addShape('path', {
      attrs: {
        stroke: '#13C2C2',
        endArrow: {
          path: 'M 0 0 L 0, -5 L -10, 0, L 0, 5 Z',
          fill: '#13C2C2'
        },
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + 2 / 3 * startPoint.x , startPoint.y],
          ['L', endPoint.x / 3 + 2 / 3 * startPoint.x , endPoint.y],
          ['L', endPoint.x - 10, endPoint.y]
        ]
      }
    });

    return shape;
  },
});

