var width = 1300;
var height = 1000;




var svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height)


// svg.call(zoom)
  // Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var pack = d3.pack()
    .size([width-150, height])
    .padding(1.5);

d3.csv("databreaches.csv", function(d) {
  d.value = numeral(d['records']).value()
  d.Call_Type = d["Entity"]

 	return d;
}, function(error, data) {
  if (error) throw error;


  // var colorScale = d3.scaleOrdinal().domain(['hacked','poor security','oops!'])
  //       .range(['lightblue', '#b3f0ff', '#d07132']);
  var colorScale = d3.scaleOrdinal()
  .domain(data.map(function(d){ return d.SECTOR;}))
  .range(['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6',
  '#ffe9a8','#b9bfe3','#fddaec','#cccccc']);

  var root = d3.hierarchy({children: data})
      .sum(function(d) { return d.value; })

  var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


  node.append("circle")
      .attr("id", function(d) { return d.id; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return colorScale(d.data.Call_Type); })
      .on('mouseover', function(d, i) {
      // transition the clicked element
      // to have a radius of 20
      d3.select(this)
        .transition()
        .attr('r',function(d) { return d.r+1; })

    })
//       .on("mouseover", function(d) {
//     div.transition()
//       .duration(200)
//       .style("opacity", .9);
//
//       var duration = 300;
//   data.forEach(function(d, i) {
//     console.log(d.value);
//     node.transition().duration(duration).delay(i * duration)
//         .attr("r", d.value);
// });
//
//
//     div.html(d.data.Call_Type + ": <br>"+d.data.value  )
//       .style("left", (d3.event.pageX) + "px")
//       .style("top", (d3.event.pageY - 28) + "px");
//   })
    .on("mouseout", function(d) {
      d3.select(this)
        .transition()
        .attr('r', 20);
  });



   node.append("text")
      .text(function(d) {
     if (d.data.value > 748|| d.data.Call_Type == "Other" || d.data.Call_Type == "Fire"){
       return d.data.Call_Type;
     }
     return "";})
     .style("font-size", "1px")
  .each(getSize)
  .style("font-size", function(d) { return d.scale + "px"; });


     function getSize(d) {
       var bbox = this.getBBox(),
           cbbox = this.parentNode.getBBox(),
           scale = Math.min(cbbox.width/bbox.width, cbbox.height/bbox.height);
       d.scale = scale;
     }
  // var legend = svg.selectAll(".legend")
  // .data(data).enter()
  // .append("g")
  // .attr("class","legend")
  // .attr("transform", "translate(" + 780 + "," + 120+ ")");
  //
  //
  //  legend.append("rect")
  //    .attr("x", 0)
  //    .attr("y", function(d, i) { return 20 * i; })
  //    .attr("width", 15)
  //    .attr("height", 15)
	// 	.style("fill", function(d) { return colorScale(d.Call_Type)});
  //
  //
  //   legend.append("text")
  //    .attr("x", 25)
  //   	.attr("text-anchor", "start")
  //    .attr("dy", "1em")
  //    .attr("y", function(d, i) { return 20 * i; })
  //    .text(function(d) {return d.Call_Type;})
  //   .attr("font-size", "12px");
  //
  //
  //   legend.append("text")
  //    .attr("x",31)
  //    .attr("dy", "-.2em")
  //    .attr("y",-10)
  //    .text("Call Type")
  // 	.attr("font-size", "17px");



});
