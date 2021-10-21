const Discord = require('discord.js')
const discordClient = new Discord.Client()
const Twitter = require('twitter-api-v2')
const twitterClient = new Twitter.TwitterApi(process.env.TWITTER_TOKEN)

//setup - console output and activity set
discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`)
    discordClient.user.setActivity("The Transfer Demon Retcon 4.0", { type: "WATCHING"})
})

//ping
discordClient.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!')
    }
})

//toggles - exclusive to ID(s)
discordClient.on('messageReactionAdd', reaction => {
    console.log('Reaction detected')
    if (reaction.id === process.env.EMOJI_ID && reaction.message.author.id === process.env.TAKASHI_ID && reaction.count >= process.env.REACT_THRESHOLD) {
        console.log('Correct emoji, user, and threshhold detected')
        if (reaction.message.content.length <= 280){
            twitterClient.v1.tweet(reaction.message.content);
            reaction.message.reply("Tweeted!")
        }
        else
            reaction.message.reply("Message was too long for Twitter :(")
    }
})

discordClient.login(process.env.BOT_TOKEN)