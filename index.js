import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import request from 'request'
dotenv.config()

/**
 * Replies to the provided message with a fact obtained by an API call
 * @param {*} message The discord message to reply to
 */
function replyWithFact(message) {
    request.get({
        url: `https://api.api-ninjas.com/v1/facts?limit=1`,
        headers: {
            "X-Api-Key": process.env.API_KEY
        }
    }, (error, response, body) => {
        const response_code = response.statusCode
        if (response_code != 200) {
            const error_msg = "An error occured when retrieving the fact. Error code - " + response_code
            message.reply({
                content: error_msg
            })
        } else {
            const fact = JSON.parse(body)[0].fact
            message.reply({
                content: fact
            })
        }
    })
}

// give permissions to the bot
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// informs when the bot is ready
client.on('ready', () => {
    console.log('The bot is ready')
})

// listens for '!fact' and replies to it with a fact
client.on('messageCreate', (message) => {
    if (message.content === '!fact') {
        replyWithFact(message)
    }
})

// authenticate using the bot token
client.login(process.env.TOKEN)