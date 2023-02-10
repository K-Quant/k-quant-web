class Node_extraction {
    constructor(name, x, y, level,rela) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.level = level;
        this.subGraph = getSubGraph(name,rela);
    }
}

class WindowManager_extraction {
    constructor() {
        this.reset();
    }

    reset() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        let element = document.querySelector("#kg-page");
        d3.select("svg").remove();
        this.svg = d3.select("body")
            .append("svg")
            .attr({
                "width": element.clientWidth,
                "height": element.clientHeight
            });
        this.force = d3.layout.force()
            .size([this.windowWidth, this.windowHeight])
            .linkDistance(250)
            .charge(-1500)
            .on("tick", this.tick);
        this.marker = this.svg.append("marker")
            .attr({
                "id": "resolved",
                "markerUnits": "userSpaceOnUse",
                "viewBox": "0 -5 10 10",
                "refX": 25,
                "refY": 0,
                "markerWidth": 10,
                "markerHeight": 10,
                "orient": "auto",
                "stroke-width": 1,
            })
            .append("path")
            .attr({
                "d": "M0,-5L10,0L0,5",
                "fill": "#000000"
            });
        this.initial = false;
        this.forceNodes = this.force.nodes();
        this.forceLinks = this.force.links();
        this.svgNodesText = this.svg.append("g").attr({"id": "nodes_text"}).selectAll(".nodes_text");
        this.svgLinksText = this.svg.append("g").attr({"id": "links_text"}).selectAll(".links_text");
        this.svgLinks = this.svg.append("g").attr({"id": "links"}).selectAll(".links");
        this.svgNodes = this.svg.append("g").attr({"id": "nodes"}).selectAll(".nodes");
    }

    render() {
        this.svgLinks = this.svgLinks.data(this.forceLinks);
        this.svgLinks.exit().remove();
        this.svgLinks.enter().insert("path")
            .attr({
                "id": function(d, i) { return "link" + i; },
                "marker-end": "url(#resolved)"
            })
            .style({
                "stroke": "#B43232",
                "stroke-width": 100
            });
        this.svgLinks.attr("d", function(d) { return "M " + d.source.x + " " + d.source.y + " L " + d.target.x + " " + d.target.y; });

        this.svgLinksText = this.svgLinksText.data(this.forceLinks);
        this.svgLinksText.exit().remove();
        this.svgLinksText.enter().insert("text")
            .attr({
                "id": function(d, i) { return "link-text" + i; },
                "dx": 40,
                "dy": 0
            })
            .style("fill", "#BBBBBB")
            .append("textPath")
            .attr("xlink:href", function(d, i) { return "#link" + i; });
        this.svgLinksText.select("textPath").text(function(d) { return d.rela; });

        this.svgNodes = this.svgNodes.data(this.forceNodes);
        this.svgNodes.exit().remove();
        this.svgNodes.enter().insert("circle")
            .attr("r", function(d) {
                if (d.level == 0) {
                    return 18;
                } else {
                    return 14;
                }
            })
            .style("fill", "#F9EBF9")
            .style("stroke", function(d) {
                if (d.level == 0) {
                    return "#A254A2";
                } else {
                    return "#FFFFFF";
                }
            })
            .on("click", this.onNodeClick)
            .call(this.force.drag);

        this.svgNodesText = this.svgNodesText.data(this.forceNodes);
        this.svgNodesText.exit().remove();
        this.svgNodesText.enter().insert("text")
            .attr("dy", "-1.7em")
            .attr("text-anchor", "middle")
            .style("fill", "#A254A2")
            .append("tspan")
            .attr("x", 0)
            .attr("y", 2)
            .attr("font-size", 14)
            .on("click", this.onNodeClick);
        this.svgNodesText.select("tspan").text(function(d) {return d.name});
        this.force.start();
    }

    tick = () => {
        this.svgNodes.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        this.svgNodesText.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        this.svgLinks.attr("d", function(d) {
            return "M " + d.source.x + " " + d.source.y + " L " + d.target.x + " " + d.target.y;
        })
        this.svgLinksText.attr("transform", function(d) {
            if (d.target.x < d.source.x) {
                let bbox = this.getBBox();
                let rx = bbox.x + bbox.width / 2, ry = bbox.y + bbox.height / 2;
                return "rotate(180 " + rx + " " + ry + ")";
            } else {
                return "rotate(0)";
            }
        });
    }

    onNodeClick = (d) => {
        console.log(this.forceNodes)
        d.fixed = true;
        for (let i = 0; i < this.forceNodes.length; i++) {
            if (this.forceNodes[i].level != 0 && !this.forceNodes[i].fixed) {
                this.forceNodes.splice(i--, 1);
            }
        }
        for (let j = 0; j < this.forceLinks.length; j++) {
            if (!this.forceLinks[j].target.fixed) {
                this.forceLinks.splice(j--, 1);
            }
        }
        let map = new Map();
        for (let relation of d.subGraph) {
            if(!map.has(relation.rela)){
                map.set(relation.rela,1);
            }
            let addFlag = false;
            for (let node of this.forceNodes) {
                if (relation.target == node.name) {
                    let linkAddedFlag = this.forceLinks.filter((link) => {
                        if (link.source.name == d.name && link.target.name == node.name) {
                            return true;
                        }
                        return false;
                    }).length;
                    if (linkAddedFlag == 0) {
                        this.forceLinks.push({source: d, target: node, rela: relation.rela, type: "resolved"});
                    }
                    addFlag = true;
                }
            }
            if (!addFlag) {
                if(map.get(relation.rela)>10 && this.initial){
                    continue
                }
                let newNode = new Node(relation.target, d.x + Math.random() * 20 - 10, d.y + Math.random() * 20 - 10, d.level + 1,"all");
                map.set(relation.rela,map.get(relation.rela)+1)
                this.forceNodes.push(newNode)
                this.forceLinks.push({source: d, target: newNode, rela: relation.rela, type: "resolved"});
            }
        }
        this.render();
        this.svgLinks.style("stroke-width", function(line) {
            if (line.source.name == d.name || line.target.name == d.name) {
                return 1;
            } else {
                return 0.5;
            }
        })
    }

    addNodes(nodes) {
        this.forceNodes.push.apply(this.forceNodes, nodes);
        this.render();
    }
}

let windowManager = new WindowManager()
windowManager.initial = true;
windowManager.addNodes([
    new Node("000001.SZ", windowManager.windowWidth/2 + 10, windowManager.windowHeight/2, 0,"all"),
    new Node("000002.SZ", windowManager.windowWidth/2 - 10, windowManager.windowHeight/2, 0,"all")
]);