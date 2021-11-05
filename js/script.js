//set the reload position to top
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function constructWaffle() {
    age = document.getElementById("age").value;

    if (age < 75) {

        dataset.push({category: "lived", count: parseInt(age) * 52, color: "#fff"});

        //https://www.worldometers.info/demographics/life-expectancy/
        dataset.push({category: "to live", count: (75 - parseInt(age)) * 52, color: "#000"});

				delay(500).then(() => 
        	DotMatrixChart( dataset, chart_options )
				);
    }

    // TODO: else {print "Congratulations, your reached a very nice age."} 
}

function add500Dots() {
    dataset[dataset.length -1].count += 500;
    DotMatrixChart( dataset, chart_options );
  }

//additional to the existing categories
  function addCategory() {
    var num = document.getElementById("myNumber").value;
    var cat = document.getElementById("category").value;
    dataset.push({category: cat, count: parseInt(num)});
    DotMatrixChart( dataset, chart_options );
  }

let colors = ['#69c242', '#64bbe3', '#ffcc00', '#ff7300', '#cf2030'];

//add a category without changing the number of dots
function splitWeeksToLive(category, placeholder) {
    WeeksToLive = 0;
    //counts the weeks of all categories except the first ("lived")
    for (let i = 1; i < dataset.length; i++) {
        WeeksToLive += dataset[i].count;
    };
    
    hoursOfActivity = document.getElementById(category).value;
    // let hoursOfActivity be placeholder, when the input is empty
    if (hoursOfActivity == 0) {hoursOfActivity = placeholder};

    lostWeeks = parseInt(hoursOfActivity / 24 * WeeksToLive);

    //let colors = ['#69c242', '#64bbe3', '#ffcc00', '#ff7300', '#cf2030'];

    //reduces free time in last category and adds new category
    dataset[dataset.length - 1].count -= lostWeeks;
    dataset.splice(dataset.length - 1, 0, {category: category, count: lostWeeks, color: colors.pop()});
    DotMatrixChart( dataset, chart_options );
  }


/**
 * SCROLL
 */
function jumpToID(id) {
  document.getElementById(id).scrollIntoView({behavior: "smooth"});
}

function showButton(id) {
  let element = document.getElementById(id);
  element.classList.remove("hidden");
}
