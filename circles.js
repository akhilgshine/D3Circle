var width = 1800;
var height = 600;




var svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height)


// svg.call(zoom)
  // Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    var forceXSeperate = d3.forceX(function (d) {
        let population = numeral(d['records']).value()
        if (population < 9900000) {
          return 200
        }
        else {
          return 800
        }


      }).strength(0.05)

      var forceXcombine = d3.forceX(function (d) {
        return width / 2
      }).strength(0.05)
      var forceY = d3.forceY(function (d) {
        return height / 2
      }).strength(0.05)

      // var forceCollide = d3.forceCollide(function (d) {
      //   return radiusScale(numeral(d['records']).value()+(Math.random() * 20))
      // })

      var simulation = d3.forceSimulation()
          .force("x", forceXcombine)
          .force("y", forceY)
          // .force("collide", forceCollide)


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
      // transition the mouse element
      d3.select(this)
        .transition()
        .attr('r',function(d) { return d.r+10; })

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
        .attr('r', d.r);
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
  var legend = svg.selectAll(".legend")
  .data(data).enter()
  .append("g")
  .attr("class","legend")
  .attr("transform", "translate(" + 1200 + "," + 120+ ")");


   legend.append("rect")
     .attr("x", 0)
     .attr("y", function(d, i) { return 20 * i; })
     .attr("width", 15)
     .attr("height", 15)
		.style("fill", function(d) { return colorScale(d.Call_Type)});


    legend.append("text")
     .attr("x", 25)
    	.attr("text-anchor", "start")
     .attr("dy", "1em")
     .attr("y", function(d, i) { return 20 * i; })
     .text(function(d) {return d.Call_Type;})
    .attr("font-size", "12px");


    legend.append("text")
     .attr("x",31)
     // .attr("dy", "-.2em")
     .attr("y",-10)
     .text("Breached Entity")
  	.attr("font-size", "17px");

  simulation.nodes(data)
        .on('tick', ticked)

        function ticked() {
            //
            // texts.attr("x", function (d) {
            //   return d.x
            // })
            // .attr("y", function (d) {
            //   return d.y
            // });
            node.attr("transform", (data)=>{return "translate("+ data.x +","+data.y+")"});
            labels
      .attr('x', d => d.x)
      .attr('y', d => d.y)

          }

});



d3.select("#seperate").on('click', function () {
    d3.forceX(function (d) {


      return width / 2
    });


  })
