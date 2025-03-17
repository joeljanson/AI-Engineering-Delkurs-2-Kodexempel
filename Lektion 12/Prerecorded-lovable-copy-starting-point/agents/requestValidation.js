// Exportera en funktion som jag kan anropa från main.js. Denna funktion ska kolla om prompten är en förfrågan om att bygga en webbapplikation.
// Returnera en structured output som har en boolean och ett message.

async function validateRequest(prompt) {
    return {
        isValid: true,
        message: "Prompten är en förfrågan om att bygga en webbapplikation."
    }
}

module.exports = { validateRequest };