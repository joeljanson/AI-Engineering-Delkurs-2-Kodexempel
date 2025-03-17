
/*

Vår kodagent skulle behöva kunna returnera en structured output som har html, css och javascript kod.
Vi behöver en bra prompt som gör att kodagenten returnerar bra kod och ser till att följa ett visst designmönster.

*/

async function generateCode(plan) {
    return {
        code: "The code is good, but it could be improved."
    }
}

async function updateCodeWithFeedback(feedback) {
    return {
        code: "The code is good, but it could be improved."
    }
}

module.exports = { generateCode, updateCodeWithFeedback };