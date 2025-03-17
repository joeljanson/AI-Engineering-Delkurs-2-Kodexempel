/*

Vi behöver en bra prompt som gör att planeringsagentent förstår vad det är vi är ute efter.
Vi vill ha structured outputs där vi har en 
projekt beskrivning, 
key features, 
htmlstruktur, 
css-struktur,
javascript struktur.
implementations guide (steg för steg tänk)

*/

async function createDeveloperRoadmap(prompt) {
    return {
        plan: "The user wants to create a web application that plays a sound using Tone.js when I click a button. Include a stop button etc..."
    }
}

module.exports = { createDeveloperRoadmap };