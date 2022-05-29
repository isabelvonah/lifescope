let person = {};

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

function restorePerson() {

    // check if id (parameter) exists
    // ...
    // yes: replace testPerson
    // no: throw error-msg

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
    document.getElementById("admin").value = testPerson.data.admin

}

