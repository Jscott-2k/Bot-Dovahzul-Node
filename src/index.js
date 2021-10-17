require('dotenv').config();

const axios = require('axios');
const { Client, Intents }  = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const prefix = "!";
const translatorURL = "https://api.funtranslations.com/translate/thuum.json";

const replyTranslated = (msg,res)=>{
    console.log(res.request);
    let data = res.data;
    console.log(data.contents.translated);
    msg.reply(data.contents.translated);
}

const handleCommand = async (msg, cmd, args) => {
    console.log("Processing Command: " + cmd);
    if (cmd === 'test'){
        msg.reply("Never Should've Come Here!");
    }else if(cmd==='dova'){
        console.log("Translating: " + args.join(" "));
        
        await axios.post(translatorURL,
        {
            "text":args.join(" "),
            "translation": "thuum"
        },{
            headers:{"X-Funtranslations-Api-Secret":process.env.FUN_API_KEY}
        }).then(res => {
            replyTranslated(msg, res);
        }).catch(error=>{
            console.log(error);
            msg.reply("Translation Request Error\n" + error); 
        });

    }else{
        await msg.reply("Command '" + cmd + "' unknown");
    }
}

client.on('messageCreate', async (msg)=>{
    if(msg.author.bot) return; 
    if(msg.content.startsWith(prefix)){
        const [cmd, ...args] = msg.content.trim().substring(prefix.length).split(/\s+/);
        await handleCommand(msg, cmd, args);
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);