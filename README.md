# Random fact discord bot

Discord bot that gets you (a) random fact(s). The facts are obtained by making requests to Facts API (https://api-ninjas.com/api/facts).

## How to

`!fact n` - the bot replies to your discord message with n number of facts.

`!howto` - the bot replies to your discord message with some info on the above command. 

### Notes
1. If n is not given, one fact is returned. 
2. Minimum n value is 1 and the maximum value is 30. Out-of-bounds n sets n to the default value - 1. 
3. The number of facts returned is sometimes less than n if the maximum character limit of 2000 for the reply is exceeded.
