// PlayOn! Sports: The Star Wars Planet People Lister
// Eric Turner (turner.eric.g@gmail.com)
// To run: node list [planet]

const axios = require('axios');

// Main execution flow function
const list = async () => {
    await fetchPlanets();
    await fetchPeople();
    displayLists();
    mergeLists();
    listResidents();
}

// Create objects to represent planets and people

let planets = [];
let people = [];

// Obtain a list of planets and people using the SWAPI and deserialize the data into lists of objects

const fetchPlanets = async () => {
    console.log('Fetching Planets...');
    let planetList = await axios.get('https://swapi.co/api/planets');
    planets = planetList.data.results;
    for (let count = planetList.data.count - 10, page = 1; count > 0; count = count - 10, page = page + 1) {
        const path = 'https://swapi.co/api/planets/?page=' + page;
        let morePlanets = await axios.get(path);
        morePlanets = morePlanets.data.results;
        planets = planets.concat(morePlanets);
    }
}

const fetchPeople = async () => {
    console.log('Fetching People...');
    let peopleList = await axios.get('https://swapi.co/api/people');
    people = peopleList.data.results;
    for (let count = peopleList.data.count - 10, page = 1; count > 0; count = count - 10, page = page + 1) {
        const path = 'https://swapi.co/api/people/?page=' + page;
        let morePeople = await axios.get(path);
        morePeople = morePeople.data.results;
        people = people.concat(morePeople);
    }
}

// Print the lists in a meaningful way

const displayLists = () => {
    console.log('\nPlanet List:');
    console.log(planets.map(p => p.name).toString());
    console.log('\nPeople List:');
    console.log(people.map(p => p.name).toString());
}

// Merge the list of planet objects with the list of people objects into a new data structure so you can 
// easily return a list of people names that belong to a given planet

let planetsAndPeople;
const mergeLists = () => {
    planetsAndPeople = planets.map(planet => {
        return {
            ...planet,
            residentDirectory: people.filter(person => person.homeworld === planet.url)
        }
    })
}

// Print a list of people names for the input planet

const listResidents = () => {
    const planetName = process.argv[2].charAt(0).toUpperCase() + process.argv[2].slice(1).toLowerCase();
    const planet = planetsAndPeople.find(p => p.name === planetName);
    if (planet && planet.residentDirectory.length) {
        console.log('\nThe residents of ' + planetName + ':');
        console.log(planet.residentDirectory.map(r => r.name).toString());
    } else if (planet) {
        console.log('\nPlanet ' + planetName + ' has no inhabitants!');
    } else {
        console.log('\nPlanet ' + planetName + ' not found in list!');
    }
}
 
// Execute main function

list();
