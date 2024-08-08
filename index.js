require('dotenv').config();
const Discord = require('discord.js')

const discordClient = new Discord.Client(
    {
        partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
    })

const Twitter = require('twitter-api-v2')
const twitterClient = new Twitter.TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET
});

//setup - console output and activity set
discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`)
    discordClient.user.setActivity("The Transfer Demon Retcon 4.0", { type: "PLAYING"})
})

//ping
discordClient.on('messageCreate', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!')
    }
})

//detect reaction and tweet if it meets the threshold, author, and emoji that we're looking for
discordClient.on('messageReactionAdd', async (reaction) => {
    console.log('Reaction detected')
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.message.author.partial) await reaction.message.author.fetch();

    console.log("Reaction emoji: " + reaction.emoji.id + " Reaction author: " + reaction.message.author.id + " Reaction count: " + reaction.count)

    if (reaction.emoji.id === process.env.EMOJI_ID && reaction.message.author.id === process.env.TAKASHI_ID && reaction.count == process.env.REACT_THRESHOLD) {
        console.log('Correct emoji, user, and threshhold detected')
        if (reaction.message.content.length <= 280){
            twitterClient.v2.tweet(reaction.message.content)
                .then()
                .catch(console.error);
            reaction.message.reply("Tweeted!");
        }
        else
            reaction.message.reply("Message was too long for Twitter :(");
    }
})

discordClient.login(process.env.BOT_TOKEN)
