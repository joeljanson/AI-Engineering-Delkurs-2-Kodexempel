/*

En otrolig styrka hos många LLMs är förmågan att översätta kod från ett språk till ett annat.
Vi kan konvertera från
Språk till språk, JS till Python (eller tvärtom)
Filformat till filformat, CSV till JSON t.ex.
Ramverk till ramverk, react till vue ex.
CSS till Sass till Tailwind till Styled components etc.

Exempelprompt på att översätta CSV till JSON:

Please convert this CSV file to JSON. Make sure to do the following:

- Lowercase and concat headers to one snake-cased word.  
- Convert Main Actors to an array  
- year and average_rating columns are nums  

Title,Main Actors,Year,Average Rating
Friends,Jennifer Aniston, Courteney Cox, Lisa Kudrow, Matt LeBlanc, Matthew Perry, David Schwimmer,1994,8.9
Seinfeld,Jerry Seinfeld, Julia Louis-Dreyfus, Michael Richards, Jason Alexander,1989,8.8
The Fresh Prince of Bel-Air,Will Smith, James Avery, Alfonso Ribeiro, Karyn Parsons, Tatyana Ali,1990,7.9
Full House,John Stamos, Bob Saget, Dave Coulier, Candace Cameron Bure,1991,6.7
The Simpsons,Dan Castellaneta, Julie Kavner, Nancy Cartwright, Yeardley Smith,1989,8.7

*/
