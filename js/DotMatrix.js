/**
 * Dieses Script basiert vorwiegend auf der d3-dotmatrix Library von Arpit Narechania.
 * https://github.com/arpitnarechania/d3-dotmatrix
 *
 * Eigene Anpassungen:
 * - Optionaler Tooltip welcher anzahl Wochen anzeigt
 * - update von veralteten Standards
 * - dynamischer Chart-Titel
 * - Möglichkeit, eingene Farben hinzuzufügen
 * - entfernen der Gruppierung mehrerer Charts
 */


function DotMatrixChart( dataset, options ) {

	/**
	 * Loads options.
	 */
	let dotRadius = options.dot_radius;
	let numOfCirclesInARow = options.no_of_circles_in_a_row;
	let dotPaddingLeft = options.dot_padding_left;
	let dotPaddingRight = options.dot_padding_right;
	let dotPaddingTop = options.dot_padding_top;
	let dotPaddingBottom = options.dot_padding_bottom;
	let divSelector = options.div_selector;

	let totalNumOfCircles = 0;
	let uniqueCategories = [];
	let colors = [];

	for( let i=0; i<dataset.length; i++ ) {
		uniqueCategories.push( dataset[i].category );
		colors.push( dataset[i].color);
		totalNumOfCircles += dataset[i]['count'];
	}


	let catcol = [];
	uniqueCategories.forEach(function(cat, i){
		let obj = {};
		obj.cat = cat;
		obj.col = colors[i];
		catcol.push(obj);
	});

	let numOfLines = Math.ceil( totalNumOfCircles/numOfCirclesInARow );

	/**
	 * Sets the dimensions of the canvas.
	 */ 
	let margin = {top: dotRadius*10, right: dotRadius*15, bottom: dotRadius*10, left: dotRadius*15};

	let height = (numOfLines+1) * (dotRadius * 2 + dotPaddingBottom + dotPaddingTop);
	let width = (dotRadius * 2 + dotPaddingLeft + dotPaddingRight) * numOfCirclesInARow;

	/**
	 * Sets the ranges.
	 */
	let xScale = d3.scale.linear().range( [margin.left, width] );
	let yScale = d3.scale.linear().range( [margin.top, height] );

	xScale.domain( [0, numOfCirclesInARow] );
	yScale.domain([0, totalNumOfCircles/numOfCirclesInARow-1 ]);

	/**
	 * Creates SVG element.
	 */
	let div = document.querySelector(divSelector);
	div.innerHTML = '';

	let svg = d3.select(divSelector)
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.bottom))
		.classed("svg-content", true);

	let globalLineNo = 0;
	let globalLineSize = 0;
	let globalDotXPosition = 0;


	/**
	 * Creates array element
	 */
	function generate_array(d) {

		let arr = new Array(d.count);

		for ( let i=0; i<d.count; i++ ) {

			if ( globalLineSize!=0 && globalLineSize % numOfCirclesInARow == 0 ) {
				globalLineNo += 1;
				globalDotXPosition=1;
			} else {
				globalDotXPosition+=1;
			}

			arr[i] = { y:globalLineNo, x: globalDotXPosition-1, category:d.category, color: d.color };
			globalLineSize += 1;

		}
		return arr;
	}


	let dotToYears = parseInt( (totalNumOfCircles / 52).toFixed(1) );


	/**
	 * Adds SVG content.
	 */
	let groups = svg
		.selectAll("g.group")
		.data( dataset )
		.enter()
		.append('g')
		.attr("class", "group");

	svg.append("text")
		.attr("x", (width / 2) - margin.right*1.3)             
		.attr("y", (margin.top / 2))
		.style("font-size", dotRadius * 5 + "px")
		.attr("id", "waffle-title")
		.text(`${options.chart_title} ${dotToYears} years`);

	let circleArray = groups.selectAll("g.circleArray")
		.data( function(d) { return generate_array(d); } );

	circleArray.enter()
		.append('g')
		.attr("class", "circleArray")
		.append("circle")
		.style("fill",function(d){ return d.color; })
		.attr("stroke", "transparent").attr("stroke-width", dotRadius * 1.3)
		.attr("r", dotRadius)
		.attr("cx", function(d) { return xScale(d.x); })
		.attr("cy", function(d) { return yScale(d.y); });


	/**
	 * Adds legend.
	 */
	let legend = svg
		.selectAll(".legend")
		.data(catcol)
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(" + 0  + "," + (margin.top+dotRadius) + ")");

	legend
		.append("circle")
		.attr("cx", width + dotRadius*4)
		.attr("cy", function(d,i){return i*dotRadius*4;})
		.attr("r", dotRadius)
		.style("fill", function(d){ return d['col']; })

	legend
		.append("text")
		.attr("x", width + dotRadius*4 + dotRadius*3)
		.attr("text-anchor",'start')
		.attr("y", function(d,i){return i*dotRadius*4 + dotRadius;})
		.style("font-size", dotRadius*3 + "px")
		.text(function(d){return d['cat']});


	function countOfCat(cat) {
		for (i = 0; i < dataset.length; i++) {
			if (dataset[i].category == cat) {
				return dataset[i].count;
			}
		}
	}


	/**
	 * Adds tooltip (optional).
	 */
	if (options.tooltip) {
		d3.selectAll(".tooltip").remove()
		let tooltip = d3.select("body")
			.append('div')
			.attr('class', 'tooltip');


		tooltip.append('div')
			.attr('class', 'category');

		svg.selectAll(".circleArray > circle")
			.on('mouseover', function(d,i) {

				tooltip.select('.category').html(`<b>${d.category}:</b> ${countOfCat(d.category)} weeks`);

				tooltip.style('display', 'block');
				tooltip.style('opacity',2);
				tooltip.style("font-size", "16px");
				tooltip.style("font-family", "var(--font-copy)");

			})
			.on('mousemove', function(d) {
				tooltip.style('top', (d3.event.layerY + 10) + 'px')
					.style('left', 'calc(30vw + ' + d3.event.layerX + 'px');
			})
			.on('mouseout', function() {
				tooltip.style('display', 'none');
				tooltip.style('opacity',0);
			});
	}

}
