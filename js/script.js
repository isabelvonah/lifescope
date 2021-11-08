const lifeExpectancy = 75 // years

/**
 * Delays execution of a function.
 */
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function debounce(func){
  let timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,200,event);
  };
}

function changePage(from, to) {
	let nextPage = document.getElementById(to);
  nextPage.scrollIntoView({behavior: "smooth"});
	nextPage.classList.add('active');
	document.getElementById(from).classList.remove('active');
}

function showButton(id) {
  let element = document.getElementById(id);
  element.classList.remove("hidden");
}

const yearsToWeeks = (years) => parseInt(years) * 52;
const weeksToYears = (weeks) => (weeks / 52).toFixed(1);
const weeksToPercentage = (weeks) => (weeks / yearsToWeeks(lifeExpectancy) * 100).toFixed(1)



/**
 * sets the reload position to top
 */
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}


let dataset = [];
let chart_options = {
	dot_radius : 4.5,
	no_of_circles_in_a_row: 70,
	dot_padding_left : 2,
	dot_padding_right : 2,
	dot_padding_top : 2,
	dot_padding_bottom : 2,
	div_selector: '#dotmatrix',
	tooltip: true 
 }
let weeksToLive = 0;
let viewportWidth = window.innerWidth;

/**
 * Updates waffle chart options based on viewport width.
 */
function updateWaffleOptions(viewportWidth) {
	if (viewportWidth < 1550) {
		chart_options.dot_radius = 3.5;
		chart_options.dot_padding_left = 1;
		chart_options.dot_padding_right = 1;
		chart_options.dot_padding_top = 1;
		chart_options.dot_padding_bottom = 1;
	} else {
		chart_options.dot_radius = 5;
		chart_options.dot_padding_left = 1.5;
		chart_options.dot_padding_right = 1.5;
		chart_options.dot_padding_top = 1.5;
		chart_options.dot_padding_bottom = 1.5;
	}
}


/**
 * Listens to resize event and changes scrolling position and
 * chart setup accordingly.
 */
window.addEventListener("resize",debounce(function(e){
	let viewportWidth = window.innerWidth;
	document.getElementsByClassName('active')[0].scrollIntoView({behavior: "smooth"});
	updateWaffleOptions(viewportWidth);
	DotMatrixChart( dataset, chart_options )
}));


/**
 * constructs waffle chart after age input
 */
function constructWaffle() {
	let age = document.getElementById("age").value;
	let ageInWeeks = yearsToWeeks(age);
	weeksToLive = yearsToWeeks(lifeExpectancy - parseInt(age));

	updateWaffleOptions(viewportWidth);
	if (age < 75) {
		dataset.push({category: "lived", count: ageInWeeks, color: "#fb8d46"});
		dataset.push({category: "to live", count: weeksToLive, color: "#0c5374"});
		
		// delays chart load to wait for scrolling to next position
		delay(500).then(() => 
			DotMatrixChart( dataset, chart_options )
		);
	}

	document.getElementById("introduction1").innerHTML = `According to ~~Quelle~~ your life expectancy is ${lifeExpectancy} years.`
	document.getElementById("introduction2").innerHTML = `So <b>${weeksToPercentage(ageInWeeks)} %</b> of your life are already over!`

	// TODO: else {print "Congratulations, your reached a very nice age."} 
}


/** 
 * Updates waffle chart. 
 * Adds a category without changing the total number of dots.
 */
function updateWaffle(category, color) { 
	let hoursOfActivity = document.getElementById(category).value;
	let lostWeeks = parseInt(hoursOfActivity / 24 * weeksToLive);

	//reduces free time in last category and adds new category
	dataset[dataset.length - 1].count -= lostWeeks;
	dataset.splice(dataset.length - 1, 0, {category: category, count: lostWeeks, color: color});
	DotMatrixChart( dataset, chart_options );
}
