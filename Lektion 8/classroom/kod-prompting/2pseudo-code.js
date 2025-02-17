/* 

Vi kan lätt konvertera pseudo-kod till "riktig" kod med hjälp av LLMs

Prompt 1:
Please write a javascript function from this pseudo-code:

function getBookById(bookArr, id)
    for each book in bookArr
        if book.id === id
            return book
        else return error object "No book found"

Prompt 2 (När vi fått tillbaka en funktion):
Generate some funny book mock data to test this function.

*/

/* 

Alternativt är att skriva ännu mer "pseudo-kod", exemplet ovan är ju nästan kod.

Prompt 1:
Write a JavaScript function findBookById which takes two arguments, bookArr and id
- for each book in bookArr, compare each bookArr id with passed in id 
  - if found, return book
  - if not found, return error object, "Sorry, no book found" 



  Övning:
  Kom på ett lite mer komplext programmeringsproblem som du skulle vilja lösa.
  Fördelen med att skriva det i pseudo-kod är att du också definierar det för dig själv, vad det är du vill göra!
  
*/
