const faker = require('faker');

const STATES = [{code: "draft", label: "Draft"}, {code: "editable", label:"Editable"}, {code: "published", label: "Published"}];
const LANGS = [{code: "eng", "name": "English"}, {code:"fra", name: "Francais"}, {code:"spa", name:"Spanish"}, {code:"ara", name:"Arabic"}];
const COUNTRIES = [{"code": "ke", "name": "Kenya"}, {"code": "mu", "name": "Mauritius"}, {"code": "tz", "name": "Tanzania"}];

randArr = (myArray) => 
     myArray[Math.floor(Math.random() * myArray.length)];

/*
doc = {
    title: '',
    country: '',
    date: null,
    lang: '',

}
*/
// MAURITIUS  |   LEGISLATION  |   FEBRUARY 26 2016  |   ENGLISH  |  ORDINANCE NO. 29/1955
let docs = { docs: [] };
for (var i=0 ; i < 50 ; i++ ) {
    let doc = {
        title: faker.lorem.words() + " " + faker.lorem.words(),
        docDate: faker.date.past(), 
        modifiedDate: faker.date.recent(0),
        country: randArr(COUNTRIES),
        type: "legislation",
        docLang: randArr(LANGS),
        docNumber: faker.lorem.slug(),
        entryIntoForceDate: faker.date.past(),
        themes: faker.random.words().split(" "),
        state: randArr(STATES)
    };
    docs.docs.push(doc);
}

console.log(JSON.stringify(docs));
