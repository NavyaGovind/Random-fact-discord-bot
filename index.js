import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import request from 'request'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', () => {
    console.log('The bot is ready')
})

client.on('messageCreate', (message) => {
    if (message.content === '!fact') {

        var profile
        request.get({
            url: `https://api.api-ninjas.com/v1/facts?limit=1`,
            headers: {
                "X-Api-Key": process.env.API_KEY
            }
        }, (error, response, body) => {
            profile = JSON.parse(body)
            message.reply({
                content: profile[0].fact
            })
        })
    }
})

client.login(process.env.TOKEN)