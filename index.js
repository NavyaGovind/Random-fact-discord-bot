import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
import request from 'request'
dotenv.config()

/**
 * Replies to the provided message with a fact obtained by an API call
 * @param {*} message The discord message to reply to
 * @param {*} facts_num The number of facts requested
 */
function replyWithFact(message, facts_num) {
    request.get({
        url: `https://api.api-ninjas.com/v1/facts?limit=` + facts_num,
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
            const fact = formatFacts(body)
            replyToMessage(message, fact)
        }
    })
}

/**
 * Formats the facts obtained into one string
 * @param {*} facts_body the JSON body that contains facts
 * @returns Formatted facts
 */
function formatFacts(facts_body) {
    const parsed_body = JSON.parse(facts_body)
    var fact_str = ""
    for (let index = 0; index < parsed_body.length; index++) {
        var temp_str = fact_str
        fact_str = fact_str + (index+1) + ". " + parsed_body[index].fact + "\n";
        // length of message needs to be less than 2000 characters
        const trimmed_msg = "Facts trimmed as the maximum character limit was exceeded\n" 
        if (fact_str.length + trimmed_msg.length >= 2000) {
            fact_str = temp_str + trimmed_msg
            break
        }
    }
    return fact_str
}

/**
 * Replies to the provided message with the given reply
 * @param {*} message the message to be replied to
 * @param {*} reply the string reply
 */
function replyToMessage(message, reply) {
    message.reply({
        content: reply
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
    if (message.content.startsWith('!fact')) {
        const msg_content = message.content.split(" ")
        var fact_num = 1
        if (msg_content.length > 1) {
            fact_num = msg_content[1]
            if (fact_num < 1 || fact_num > 30) {
                fact_num = 1
            }
        }
        replyWithFact(message, fact_num)
    } else if (message.content.startsWith('!howto')) {
        const howto_msg = "To get a random fact, type '!fact'.\nYou can follow this with a number to get that number of facts.\nDoing '!fact 4' will get you 4 facts.\nThe default number of facts is 1 and the maximum you can receive is 30." 
        replyToMessage(message, howto_msg)
    }
})

// authenticate using the bot token
client.login(process.env.TOKEN)