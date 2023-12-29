const Snapchat = require("./snapchat.js");
const axios = require('axios');
let history = []; // Initialize chat history
var sentdiscordmsg = "";
var isDiscordmsg = false;

const { Client, IntentsBitField } = require('discord.js');
const config = require('./config.json');

const toUnicodeVariant = require('./toUnicodeVariant.js'); 
const channelID = config.channelid;
const webhookUrl = config.webhook;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', (c) => {
  console.log("${c.user.tag} is online.");
});

(async () => {
	const snapclient = await Snapchat.Login();
	const chats = await snapclient.GetChats();
	await snapclient.OpenChat(chats[1]); // open first chat
	
	// event only fires when a chat is open
	snapclient.events.on("message", async (message) => {
		
		console.log(message);
		if (message.content.includes("@zzzzznick-ai") || message.content.includes("@zzzzzzNickAI")) {
            // Send the combined message to the OpenAI API
			let tempmessage;
			if (message.content.startsWith("@nick-ai")) {
            tempmessage = message.content.slice(8).trim();
			}else{
            tempmessage = message.content;
			}
			
			if(tempmessage.startsWith("lobotomy") || tempmessage.startsWith("forgor")){
			history = [];
			 await snapclient.SendMessage("What the fuck do you want?");
			}else{
			const responseText = await getAIResponse(message.content);
			console.log(responseText)
            // Extract and send the response from OpenAI
            //const responseText = openaiResponse.data.choices[0].text.trim();
			if (responseText) {
            await snapclient.SendMessage(responseText);
			
			// Update chat history with the new message and OpenAI response
            history.push({"role": "assistant", "content": responseText});
			}						
			}
			
		}else{
			
		}
		
		//if(message.content == sentdiscordmsg)){
	    if(isDiscordmsg){
			isDiscordmsg = false;
			return;
		}
		
		const messageData = {
			username: message.author, // Default value
			avatar_url: "https://cdn1.iconfinder.com/data/icons/social-media-circle-7/512/Circled_Snapchat_svg-512.png",
			content: message.content
		};
			
		if (config.authors.hasOwnProperty(message.author)) {
		const avatarUrl = config.authors[message.author];
		// Check if avatarUrl is not null (i.e., not specified as null in config)
		if (avatarUrl !== null) {
			messageData.avatar_url = avatarUrl;
		} 
		}

		axios.post(webhookUrl, messageData)
			.then(response => {
			console.log('Message sent successfully:', response.data);
		})
		.catch(error => {
			console.error('Error sending message:', error);
		});
	});
		
	client.on('messageCreate', (message) => {
		console.log(channelID);
		if(message.channel.id !=channelID){
			return;
		}
		if (message.webhookId) {
		return;
		}
			
		if (message.author.bot) {
		// Check if the sender is a bot
			//snapclient.SendMessage(sentdiscordmsg = `${toUnicodeVariant(message.member.nickname, 'b')}(BOT): ${message.cleanContent}`);
			if(message.author.username == "NickAI"){
				snapclient.SendMessage(sentdiscordmsg = `${message.cleanContent}`);
			}else if(message.author.username == "BabaAI"){
				snapclient.SendMessage(sentdiscordmsg = `𝐄𝐦𝐢𝐥𝐢𝐚𝐀𝐈: ${message.cleanContent}\n`);
			}else{
				snapclient.SendMessage(sentdiscordmsg = `${toUnicodeVariant(message.member.nickname || message.author.displayName, 'm')}(BOT): ${message.cleanContent}`);
			}
			isDiscordmsg = true;
		}else{
			if(message.attachments.size > 0){
				const attachmentUrl = message.attachments.first().url;
				snapclient.SendMessage(sentdiscordmsg = ` ‏‏‎ \n${toUnicodeVariant(message.member.nickname || message.author.displayName, 'm')}: ${attachmentUrl}\n ‏‏‎ `);
			}else{
				snapclient.SendMessage(sentdiscordmsg = ` ‏‏‎ \n${toUnicodeVariant(message.member.nickname || message.author.displayName, 'm')}: ${message.cleanContent}\n ‏‏‎ `);
			}
			isDiscordmsg = true;
			//snapclient.SendMessage(sentdiscordmsg = `${toUnicodeVariant(message.member.nickname, 'b')}: ${message.cleanContent}`);
		}
		//sentdiscordmsg = message.content;
	});
})();

client.login(config.token);

async function getAIResponse(prompt) {
    const url = 'http://127.0.0.1:5000/v1/chat/completions';
	const temphistory = history.slice();
	temphistory.push({"role": "user", "content": prompt});
	
	let assistant_message;
	
    const headers = {
        'Content-Type': 'application/json',
    };

    const data = {      
		"mode": "chat",
        "character": "NickAISnap",
        "messages": temphistory,
		"instruction_template": "Custom",
        "max_new_tokens": 2056,
        "temperature": 1.31,
        "top_p": 0.14,
        "top_k": 49,
        "repetition_penalty": 1.17,
        "repetition_penalty_range": 1024,      
        "typical_p": 1,
        "tfs": 1,
        "top_a": 0,
        "epsilon_cutoff": 0,
        "eta_cutoff": 0,         
        "encoder_repetition_penalty": 1,
        "min_length": 0,
        "no_repeat_ngram_size": 0,
        "num_beams": 1,
        "penalty_alpha": 0,
        "length_penalty": 1,
        "mirostat_mode": 0,
        "mirostat_tau": 5,
        "mirostat_eta": 0.1,
        "seed": -1,
        "stream": false,
		"do_sample": true,
		"add_bos_token": true,
		"skip_special_tokens": true,
        "stopping_strings": []	
    };

     try {
        const response = await axios.post(url, data, { headers });
        const assistantMessage = response.data.choices[0].message.content;
        console.log(response.data);
		if(assistantMessage){
			history.push({"role": "user", "content": prompt});
		}
        // history.push({"role": "assistant", "content": assistantMessage});
        return assistantMessage;
    } catch (error) {
        console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
        throw error;
    }
}
