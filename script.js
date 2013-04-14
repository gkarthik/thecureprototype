
var width = 960,
    height = 2200;

var origin=[];
radius = 4.5;
 
var cluster = d3.layout.cluster()
    .size([height, width-160]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");

  var nodes = cluster.nodes(json_data),
      links = cluster.links(nodes);

var drag = d3.behavior.drag()
    .on("dragstart",function(d){origin["x"]=d.x;origin["y"]=d.y})
    .on("drag", dragmove);
    
  var link = svg.selectAll(".link")
      .data(links)
	  .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll(".node")
      .data(nodes)
	  .enter().append("g")
      .attr("class", "node")
      .attr("id",function(d){return d.name;})
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .call(drag)
      .on("click", function(d) { d3.select(this).style("fill", "purple"); });

  node.append("circle")
      .attr("r", 4.5);

  node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .attr("class","node-anchor")
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });

var position;
var distance=0;
var min=1000000;
var min_name="";
d3.select(self.frameElement).style("height", height + "px");

function dragmove(d) {
	var name=d.name;
	d3.select(this)
	  .attr("transform", "translate(" + parseInt(d3.event.x) + "," + parseInt(d3.event.y) + ")");
    var data=d3.selectAll(".node").data();
    min=10000;
    for(var temp in data)
    {
		if(data[temp]["name"]!=name)
		{
			distance = Math.sqrt(Math.pow(parseInt(d3.event.x-data[temp]["y"]),2)+Math.pow(parseInt(d3.event.y-data[temp]["x"]),2));
			if(distance<min)
			{
				min=distance;
				min_name=data[temp]["name"];
			}
		}
	}
	
	var children = d3.selectAll("#"+min_name).data()[0].children;
	var flag=1;
	for(var temp in children)
	{
		if(children[temp]["name"]==name)
		{
			flag=0;
		}
	}
	if(flag==1)
	{
		d3.selectAll("#"+min_name).data()[0].children.push({"name":name});
	}
	
	console.log(d3.selectAll("#"+min_name).data()[0].children);
	
	//update();
}


function update()
{
	  var link = svg.selectAll(".link")
      .data(links)
	  .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll(".node")
      .data(nodes)
	  .enter().append("g")
      .attr("class", "node")
      .attr("id",function(d){return d.name;})
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .call(drag)
      .on("click", function(d) { d3.select(this).style("fill", "purple"); });

  node.append("circle")
      .attr("r", 4.5);

  node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .attr("class","node-anchor")
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
			console.log(obj);
            objects.push(obj);
        }
    }
    return objects;
}
