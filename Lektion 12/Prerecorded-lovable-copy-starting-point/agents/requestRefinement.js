
/*

Vi behöver en prompt som gör att förfiningsagenten förstår vad det är vi är ute efter.

*/

async function refineRequest(prompt) {
    return {
        refinedPrompt: "The user wants to create a web application that plays a sound using Tone.js when I click a button. Include a stop button etc..."
    }
}

module.exports = { refineRequest };