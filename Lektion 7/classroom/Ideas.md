# Gör en rese agent.

Skapa ett agentiskt system genom att kedja ihop ett antal anrop till en modell.

## Steg 1 - Destination och preferenser

Exempelprompt: "Given the destination ‘Paris’ and interests in art, cuisine, and local history, list the top 10 must-see attractions."

Invänta svar och skicka vidare till "agent 2".

## Steg 2 - Gruppera förslagen från den första agenten enligt geografisk närhet

Exempelprompt: “Group these attractions by their location so that they can be visited in a single day with minimal travel.”

Invänta svar och skicka vidare till "agent 3".

## Steg 3

Exempelprompt: “Using the grouped attractions, create a day-by-day itinerary with estimated visiting times and meal breaks. Ensure that the schedule is realistic.”

Invänta svar och skicka vidare till "agent 4".

## Steg 4

Exempelprompt: “Summarize the itinerary in a concise format. If any day seems too packed, suggest slight adjustments.”

Invänta svar och visa upp!

Logga gärna varje steg och justera mina exempelprompts för att ange hur många dagar ni vill vara på vald destination, ändra intressen, ändra "attractions" till "restaurants".

Byt ut till att lösa en annan men liknande uppgift! (Be en LLM om hjälp om ni inte har någon idé på rak arm.)
