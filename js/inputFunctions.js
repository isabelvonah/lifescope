function constructWaffle() {
    age = document.getElementById("age").value;

    if (age < 75) {

        dataset.push({category: "lived", count: parseInt(age) * 52});

        //https://www.worldometers.info/demographics/life-expectancy/
        dataset.push({category: "to live", count: (75 - parseInt(age)) * 52});

        DotMatrixChart( dataset, chart_options );
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

//add a category without changing the number of dots
function splitWeeksToLive(category) {
    WeeksToLive = 0
    for (let i = 1; i < dataset.length; i++) {
        WeeksToLive += dataset[i].count;
    }
    lostWeeks = parseInt(document.getElementById(category).value / 24 * WeeksToLive);
    dataset[dataset.length - 1].count -= lostWeeks;
    dataset.splice(1, 0, {category: category, count: lostWeeks});
    DotMatrixChart( dataset, chart_options);
  }