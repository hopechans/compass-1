import G6 from "@antv/g6";

const Util = G6.Util;
G6.registerNode(
  "pipeline-node",
  {
    draw(cfg: any, group: any) {
      const r = 7;
      const rect = group.addShape("rect", {
        attrs: {
          fill: "lightblue",
          stroke: "#888",
          lineWidth: 1,
          radius: 7,
          width: 80,
          height: 35,
          top: true,
        },
        draggable: true,
      });

      const textConfig = {
        textAlign: "left",
        textBaseline: "top",
      };

      group.addShape("text", {
        attrs: {
          ...textConfig,
          x: 20,
          y: 15,
          text: cfg.taskName,
          fontSize: 10,
          fill: "#000",
          cursor: "pointer",
          isTitleShape: true,
        },
      });

      return rect;
    },

    setState(name: any, value: any, item: any) {
      if (name === "hover" && value) {
        const group = item.getContainer();
        const lightColor = "lightblue";
        const collapsed = true;
        const rectConfig = {
          width: 80,
          height: 35,
          lineWidth: 1,
          fontSize: 12,
          fill: "#fff",
          radius: 24,
          stroke: lightColor,
          opacity: 1,
        };

        group.addShape("circle", {
          name: "test",
          attrs: {
            x: rectConfig.width + 9,
            y: rectConfig.height / 2,
            r: 8,
            stroke: lightColor,
            fill: collapsed ? lightColor : "",
            isCollapseShape: true,
          },
        });

        group.addShape("text", {
          name: "right-plus",
          attrs: {
            x: rectConfig.width + 9,
            y: rectConfig.height / 2,
            width: 20,
            height: 20,
            textAlign: "center",
            textBaseline: "middle",
            text: collapsed ? "+" : "-",
            fontSize: 10,
            fill: collapsed ? "#00000" : lightColor,
            cursor: "pointer",
            isCollapseShape: true,
          },
        });

        setTimeout(() => {
          const shape = group.get("children");
          group.removeChild(group.get("children")[shape.length - 2]);
          group.removeChild(group.get("children")[shape.length - 1]);
        }, 1000);

        group.addShape("circle", {
          name: "test",
          attrs: {
            x: rectConfig.width / 2,
            y: rectConfig.height + 9,
            r: 8,
            stroke: lightColor,
            fill: collapsed ? lightColor : "",
            isCollapseShape: true,
          },
        });
        group.addShape("text", {
          name: "bottom-plus",
          attrs: {
            x: rectConfig.width / 2,
            y: rectConfig.height + 9,
            width: 16,
            height: 16,
            textAlign: "center",
            textBaseline: "middle",
            text: collapsed ? "+" : "-",
            fontSize: 10,
            fill: collapsed ? "#00000" : lightColor,
            cursor: "pointer",
            isCollapseShape: true,
          },
        });

        setTimeout(() => {
          const shape = group.get("children");
          group.removeChild(group.get("children")[shape.length - 2]);
          group.removeChild(group.get("children")[shape.length - 1]);
        }, 1000);
      }
    },

    getAnchorPoints() {
      return [[0.5, 0.5]];
    },

    afterDraw(cfg, group) {
      const size = [25, 50];
      const width = size[0] - 12;
      const height = size[1] - 12;
      const image = group.addShape("image", {
        attrs: {
          x: -width / 2,
          y: -height / 2,
          width,
          height,
          img:
            "data:image/webp;base64,UklGRq4FAABXRUJQVlA4IKIFAABwHwCdASo8ADwAPiEMhEGhhv6rQAYAgS2NHsdCq/4D8AOoA64OEUAj/XPxVwyvRGvyO/gGxN/t3oK/1X6zesX3L/p/RP/2HCgKAB9AGeAbCB+AGwAbQBtA/8c/m/4PYHTonm+SzRH6B9sv2i/rOZC+G/ln9l/ML/GdoD7APcA/TD+09QDzAfrX+vHYM9AD+Uf0zrAPQA/bH0vv2t+CH9qf2R+A39e6X098/I7IAcLcs8Gjmc/9T7gPbX9H+wJ+rPVV9En9ZmBI5oUiYhkYHIVjRr9hzCTPcV5Rs/wjjIHkxPgtr/3ALZSuUm146HHwqQVA23hnnqH/4aJ/k4v4hU6RBZ0AAAD+//8ARPyL9yWIlAbWBAD0oKSqlYWreuRa3Oj02u+TvSQS8iwMYewUYTWLDNp9wOlFJaWnqE+za35UwUXuDAT6T0I4fwY+u+qrRVhl+S1ir4X7BQiNswug5AX+MjQcXEeUwfSIEUT+DFPCr+BUiwTbFxLni7fv61vRbmXoauLz4tiqOFTzEGP8tNXP5+H7mZVGfNjIxapT3FGUtqBdp/SD5cTOYOkn2fawkpqpCSqf2+CfiGWtIF673fEzlk/hIbWDhQ81C/ddxLn609d/5efckbdZ8HZbhhVmM82/Uat7CFmw1SH5xCxRxEEhjpf1EP1Xn5q9VZfm1+OFTab/MN67Xha8K//5oVBlMgZALE653X0fas/+2xMqiyCu5Wa7PHsCwbBwqROfNmzi4LPOTjkFPHVKDD1Nfj4/sul6cANdF68rf2jszlyZsUUoLTP7H3swSroc3ssNXSRVAcYd7+iBZpfoAYWvKgnr+Hv62fHZX5ZbjYbYzVjq6fsXkubto858NuUx4+ILb5y7dP6W3/IYVeUSF0yZseKIZhOMs9BBf5uB2Y3Ott//+1OG7hYINzcqigrzWAOJbSmVw3G0ULywkobx+rvfk8VmZFzQGgP/+4T74mp/vsZyM1NLguiTO2gNO05tcpXwveq5mrcweXrJ/bRZDmU2KBrnXhkXq+735c+UHTFq4h4jMOPm5shKioB6XaqhUf3DJlMg8937g/SKjrgD0H5sNm0/k4FfilBbcrsjc3dd6cwEYJo3CNhe3SpNJ2geNXyV4/hq/BZXZ1kiVknjmf5cUx7Tv/9Sb+fQ/DgAsRNSz1wiVodiLjP7aVrkxbWx5gJ8U/j0o1Ipm/nyDZRPrQXmbPAcy1eDDejxTDBKe42ElHpC2QlFdhOedsp4i9QVjt8EqWGy1YzPaGqZhCVg/LWt8/+4BmiCzNGtpR21MGJf4kI/n/1sbe36e1QBCBAx4EVfTM82ZM2lh0P189e7eY0A3NzXWVrUek8SEn+DYYCQeEaC5hDHGreFHT1baY6KyrFx3G9oMm3fLrCqmNjFRnZa3LB/5m8FgCpq9B/1OCLRE5GzVTZnVzj/4V38PgCIpX16Kznijf01+MkDeS9oCF2hEXQ9tr+mPLrjGy4Cg5fyLgyCj1fUq33nMf79Svli2h83m3gqkoxJcXvBetFQP8V/gRjBNGmFXK5TfwLhbolWEjDqUGK3n+hxzQLif9zreYO88EIRTUNbzE1/Sn7rBEtjB0uawNje5OubWsB62SOlMZoZpxrDbMb4UvQrODPhSafmhcYe9zm/dHxssMfUthhDKjyMhoRhngPjbzfGXmIV2Omgrn/zbefK/PawUGSH6x4Qk4HCN4/X8S+XCf51JJtOQeHST/yfwg69uMkE07SONnhGUrL6j5oQn6JI+zkaH/H/P/Ti/pfOTfAWxQNiMvWX08mqbuUweFSQ/G5YUP/uCvZAXutf1+Nhl2jj/n4/fPOihPjwvfFnnjOaQvs9PSpF33d+396LASZ3IID/4UP4pf9eOMXw82ccoUUUHX6MfBWyBDvARCrdPmerUwKwW+lBIAe1dsAAAA==",
          label: "Image Rotate",
        },
        name: "image-shape",
      });
      image.animate(
        (ratio: number) => {
          const matrix = Util.mat3.create();
          const toMatrix = Util.transform(matrix, [["r", ratio * Math.PI * 2]]);
          return {
            matrix: toMatrix,
          };
        },
        {
          repeat: true,
          duration: 300,
          easing: "easeCubic",
        }
      );
    },
  },

  "single-node"
);

G6.registerEdge(
  "line-arrow",
  {
    options: {
      style: {
        stroke: "#ccc",
      },
    },
    draw(cfg: any, group: any) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;

      const stroke =
        (cfg.style && cfg.style.stroke) || this.options.style.stroke;
      const startArrow = (cfg.style && cfg.style.startArrow) || undefined;
      const endArrow = (cfg.style && cfg.style.endArrow) || undefined;

      const keyShape = group.addShape(
        "path",
        {
          attrs: {
            path: [
              ["M", startPoint.x, startPoint.y],
              // ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
              ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
              ["L", endPoint.x, endPoint.y],
            ],
            stroke,
            lineWidth: 1,
            startArrow,
            endArrow,
          },
          className: "edge-shape",
          name: "edge-shape",
        },
        "cubic"
      );
      return keyShape;
    },
  },
  "cubic-horizontal"
);

G6.registerEdge("hvh", {
  draw(cfg, group) {
    return this.drawShape(cfg, group);
  },
  drawShape(cfg: any, group) {
    // const startPoint = cfg.startPoint;
    // const endPoint = cfg.endPoint;
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;
    console.log(startPoint);
    console.log(endPoint);
    const shape = group.addShape("path", {
      attrs: {
        stroke: "#959DA5",
        lineWidth: 3,
        // endArrow: {
        //   path: 'M 0 0 L 0, -5 L -10, 0, L 0, 5 Z',
        //   fill: '#959DA5'
        // },
        path: [
          ["M", startPoint.x, startPoint.y],
          ["L", endPoint.x / 3 + (2 / 3) * startPoint.x - 10, startPoint.y],
          ["L", endPoint.x / 3 + (2 / 3) * startPoint.x - 10, endPoint.y],
          ["L", endPoint.x - 10, endPoint.y],
          // ['A', endPoint.x - 10, endPoint.y]
        ],
      },
    });

    return shape;
  },
});

G6.registerNode(
  "card-node",
  {
    drawShape: function drawShape(cfg: any, group: any) {
      const color = cfg.error ? "#F4664A" : "#30BF78";
      const r = 5;
      const shape = group.addShape("rect", {
        attrs: {
          x: 2,
          y: 2,
          width: 180,
          height: 41,
          lineWidth: 2,
          // stroke: '#444D55',
          radius: r,
          fill: "#fff",
        },
        name: "main-box",
        draggable: true,
      });

      group.addShape("rect", {
        attrs: {
          x: 0,
          y: 0,
          width: 179,
          height: 40,
        },
        draggable: true,
      });

      // 标题
      group.addShape("text", {
        attrs: {
          y: 20,
          x: 5,
          height: 16,
          width: 16,
          text: cfg.taskName,
          style: {
            fontWeight: 900,
          },
          fill: "black",
        },
        name: "title",
      });

      group.addShape("image", {
        attrs: {
          x: 140,
          y: 10,
          width: 25,
          height: 25,
          img:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAYAAAAuqZsAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARMSURBVFhHvZjNbtRWFMct8QSFN6AvQHkB4AnaFyjddQtblhGrgJAqtUsqwaZQsQKEIBILEBCgixaQCERBSQhQSOZ7Mh+Zmcwc/DvJsa5v7jieqdMr/SWPfT5+Pufea3siCYzRaKQaDoeyvb0tg8FA+v2+9Ho92drakm6sTrcr3VidTiclPce12AZbfPAlBrGIafGzxh4wF8oFIhFJ/y235MZfFfnp9w9y6uKKfDfzTg79vKDimHNcwwZbfPB1AfPApcAMyKpkQFTi2VJdfvjtfQKRV/jgq9XcBfSrFxoJmAvFndEGWvLmY1MrEEo6iYhBLGISmxxZcAq2Byq+K+7wz+dlOXzmbTDRNCLW3KuaxiZHFlw0DurSvfVg8CJE7P3gFGwP1NxGMGCRIocPB4vBRZAyGXVOxYa0LxToIJS0Nc7trlYFs9XHpFz40Ch0Tu0ncpGT3LZaDS6ijCzjdrstp6dYfd+eW5KZWyUVxyGbLJGT3DC4LY20WnE55xerQcdxAuLKk5qWvd4ZqhicmxSQ3DC4VYsgbbVa8v2vq0EnXyS99aKpEFuDkczeK8mRs4uqmdsbUwGSGwar2g5Y3N+PG82gg69f7lc0KckfLLak0R1Krb2tbQQMGx8QHz9OSJubm/r4omq0M6K/13OsxLnXrbj3EgO15ehuJVwIHxAbbPHB140VEgyw2AqNKOGPl9eCxq6eLHVkrdLXKmRVaaeabbVhvFvvqa8fzxcMbjsjSnjywkrQ2NXDOBli3lyd35n0LiCavVuWbn+nhbdfNtUWYPxCMV3BAAtbh4I1m83Uq8s4GZj9dgHbvZGKwTl30ucFgwEWm2cKFjL05YOZgPjSGKhcIFNeMASLbRtR4z+CIeYUCl2bBAyWFNixKVrpqggwGFJglG+SyR+6VgQYDKlW8iPPdnHzn6a8WOsmW4SrcWDYch5f/5ovGGBJJj9L9NqzUtDY1fHzy8GNFPlgXMMGW3zwtWvjBENqu2BTe/+5FjT25W4RLqCBuUAMf+vIUq1eT2+wPAaYdHkf4sgHXC33VdMAIXLDkHok0VNK+PhtvoetKxeQMSmQidwwpB7i9tpTbzRyLYKiRU5yu23U1x4IWaKsiFerVfnmf3y1Jhc53W0ieVGEEFKba9eeHvwXkunO36Vkblm1kldrCLVqu3ONsl68+yUYqEiRg1y2RbjVUjAOOGGfbxiydA8SjtjkUKg4Z/DzjQPKRxntg5ee40hbi5xzxKJ9xLZ5NfaDlwNIfThr68vlciGrlRjEStrnQbnVYmT+qUIAJme1VpNHC6WJNmETPvgSg1h5oBj7/g3FiqHs3CnBVz5V5I/5da3Aidnl1CsTx5zjGjaVSkV98CUGsYhJ7CwoRu4/7tgArYLMERJWq1UVAAqx+5tr2FiF8CUGsWz1ZUExUmAMDA2QANyZAfLI4K4NkiogAJD9Nhjdn2IfAyKWu/rGQYmIfAXuNFIXGDKDxgAAAABJRU5ErkJggg==",
        },
        name: "image-shape",
      });

      group.addShape("image", {
        attrs: {
          x: 10,
          y: 25,
          width: 15,
          height: 15,
          img:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGSSURBVEhL7ZFLSwJRGIb7PwVREfQDKrRQutIiohIKKlu0iIgW7YOiP9DeMgLRvCUVWmAJkUFQVBQaXTXLyzg6zrydM3OwaLRUaOczu/N985z3O18N/omqOE9VnKdisUS+pJDCyes5PjIJiJLEKgoViamUynbCBxhwT8Ny6wEnpFlVoWwxlcazSbjCXrRbh1G3rkG/awovXJR1KJQtpsnsoX20EWmtSYNW6xDOopfIigLrUChLzIsZeWytbZQk1aJj24Bg5AKClGMdX6jEoiQiwscw71+SF5PO8fI5n8vAfOOA3jGO+o1O9JHx/U+nJGlWrv9EJY5l4lgJrqFlq5e8nRHehwDe+HeYrmzocU6iwazDoGeGnB/nLy2ESkybfY8BaMi4NBmVLBwtk4RGNJr1GNmdhef+ECmBY38URiWmW0+RBVnuPNDZx+SEzZtdaCJSw94cXCEfktkU6y5O0eXRRdE37XZOyEkVqReJEqSUomIKXZjp2obFwCrcYV/JUsqvYgqVP3ORksb/zp/iSqmKGcAncmSXV+WwdxEAAAAASUVORK5CYII=",
        },
        name: "image-shape",
      });

      group.addShape("text", {
        attrs: {
          y: 40,
          x: 28,
          height: 16,
          width: 16,
          text: "Succeeded .",
          fill: "gray",
        },
        name: "title",
      });

      return shape;
    },
    setState(name: any, value: any, item: any) {
      const group = item.getContainer();
      if (name === "hover" && value) {
        const lightColor = "lightblue";
        const collapsed = true;
        const rectConfig = {
          lineWidth: 1,
          fontSize: 12,
          fill: "#fff",
          radius: 24,
          stroke: lightColor,
          opacity: 1,
        };

        group.addShape("circle", {
          name: "test",
          attrs: {
            x: 192,
            y: 25,
            r: 8,
            stroke: lightColor,
            fill: collapsed ? lightColor : "",
            isCollapseShape: true,
          },
        });

        group.addShape("text", {
          name: "right-plus",
          attrs: {
            x: 192,
            y: 25,
            width: 20,
            height: 20,
            textAlign: "center",
            textBaseline: "middle",
            text: collapsed ? "+" : "-",
            fontSize: 10,
            fill: collapsed ? "#00000" : lightColor,
            cursor: "pointer",
            isCollapseShape: true,
          },
        });

        // setTimeout(() => {
        //   const shape = group.get("children");
        //   group.removeChild(group.get("children")[shape.length - 2]);
        //   group.removeChild(group.get("children")[shape.length - 1]);
        // }, 1000);

        group.addShape("circle", {
          name: "test",
          attrs: {
            x: 90,
            y: 53,
            r: 8,
            stroke: lightColor,
            fill: collapsed ? lightColor : "",
            isCollapseShape: true,
          },
        });
        group.addShape("text", {
          name: "bottom-plus",
          attrs: {
            x: 90,
            y: 53,
            width: 16,
            height: 16,
            textAlign: "center",
            textBaseline: "middle",
            text: collapsed ? "+" : "-",
            fontSize: 10,
            fill: collapsed ? "#00000" : lightColor,
            cursor: "pointer",
            isCollapseShape: true,
          },
        });

        // setTimeout(() => {
        //   const shape = group.get("children");
        //   group.removeChild(group.get("children")[shape.length - 2]);
        //   group.removeChild(group.get("children")[shape.length - 1]);
        // }, 1000);
      }

      if (name === "hover" && !value) {
        const shape = group.get("children");
        console.log(shape);
        setTimeout(() => {
          group.removeChild(group.get("children")[shape.length - 2]);
          group.removeChild(group.get("children")[shape.length - 1]);
        }, 100);
        setTimeout(() => {
          group.removeChild(group.get("children")[shape.length - 2]);
          group.removeChild(group.get("children")[shape.length - 1]);
        }, 100);
      }

      if (name === "click") {
        let shape = group.get("children")[2];
        shape.attr({ text: value });
      }
    },
    update(cfg, node) {
      let group = node.getContainer();
      let res = group.get("children");
      let titleIndex;
      for (var i = 0; i < res.length; i++) {
        // console.log(res[i].cfg.name);
        if (res[i].cfg.name === "title") {
          group.removeChild(group.get("children")[i]);
        }
      }
    },
  },
  "single-node"
);
