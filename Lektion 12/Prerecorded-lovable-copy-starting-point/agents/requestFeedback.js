/*

Vår feedbackagent behöver inte returna en structure output. Utan kan helt enkelt hänvisa till koden som den fått.
Vi skulle därmed kunna använda oss av en thinking model från gemini.

*/

async function provideFeedback(code) {
    return {
        feedback: "The code is good, but it could be improved."
    }
}

module.exports = { provideFeedback };