enableEnterKey("login", "loginButton");
enableEnterKey("review", "reviewButton");

let person = {};
let loggedIn = false;

function createPerson() {
    person.id = uuid();
    person.nickname = document.getElementById("nickname").value;
    person.age = document.getElementById("age").value;
    person.sex = sex; // from front1.js..
}

function createDataObject() {
    person.data = {};
    person.data.sleep = document.getElementById("sleep").value;
    person.data.work = document.getElementById("work").value;
    person.data.ageOfRetirement = document.getElementById("ageOfRetirement").value;
    person.data.media = document.getElementById("media").value;
    person.data.admin = document.getElementById("admin").value;

    // should post or put person, depending on existance of id
    
}

function setKey() {
    document.getElementById("key").innerHTML = person.id;
}

function clickButtonIfLoggedIn(button) {
    if (loggedIn) {
        document.getElementById(button).click();
    }
}

let testPerson = {
    id: "aösdkfjaösdfjk",
    nickname: "test",
    age: "25",
    sex: "female",
    data: {
        sleep: "6",
        work: "30",
        ageOfRetirement: "70",
        media: "0.5",
        admin: "0.5"
    }
}

function checkId() {
    if (document.getElementById("login").value != "") {

        // replace testPerson...!

        return true; 
    } else { 
        return false; 
    }
}

function restorePerson() {

    // check if id (parameter) exists
    if (checkId() == true) {

        document.getElementById("nickname").value = testPerson.nickname;
        document.getElementById("age").value = testPerson.age;
        
        if (testPerson.sex == "female") {
            document.getElementById("female").classList.add('selected');
            document.getElementById("male").classList.remove('selected');
            setSex("female");
        } else if (testPerson.sex == "male") {
            document.getElementById("male").classList.add('selected');
            document.getElementById("female").classList.remove('selected');
            setSex("male")
        } else {
            document.getElementById("male").classList.remove('selected');
            document.getElementById("female").classList.remove('selected');
        }

        document.getElementById("sleep").value = testPerson.data.sleep;
        document.getElementById("work").value = testPerson.data.work;
        document.getElementById("ageOfRetirement").value = testPerson.data.ageOfRetirement;
        document.getElementById("media").value = testPerson.data.media;
        document.getElementById("admin").value = testPerson.data.admin;

        resetError('login');
        document.getElementById("login-instruction").classList.remove('hidden');

        loggedIn = true;
    
    } else {
        printError('login', 'Please provide a valid key!');
    }

}

function postReview() {
    console.log("post review");
}