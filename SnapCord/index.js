const Snapchat = require("./snapchat.js");
const axios = require('axios');
const { DateTime } = require("luxon");
let history = []; // Initialize chat history
var sentdiscordmsg = "";
var sentdiscordauthor = "";
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
		/*if (message.content.includes("@zzzzznick-ai") || message.content.includes("@zzzzzzNickAI")) {
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
		}else {
		}
		*/
		if(isDiscordmsg){
			message.content = sentdiscordmsg;
			message.author = sentdiscordauthor;
		}
		
		if(message.content.startsWith("!say ")){
		snapclient.SendMessage(message.content.slice(5));
		}else if(message.content.startsWith("!time")){
		const currentTimeInEST = getCurrentTimeInEST();
		const hours = DateTime.fromFormat(currentTimeInEST, "h:mm a").hour;
		if (hours >= 0 && hours < 2) {
			snapclient.SendMessage(`It's ${currentTimeInEST}\nGo to bed ${message.author}.`)
		} else if (hours >= 2 && hours < 5) {
			snapclient.SendMessage(`IT'S ${currentTimeInEST}\nGO TO FUCKING SLEEP ${(message.author).toUpperCase()}!!`);
		} else if (hours >= 5 && hours < 8) {
			snapclient.SendMessage(`It's ${currentTImeInEST}\nGood morning ${message.author}! \n Your up early nigger.`);
		} else if (hours >= 8 && hours < 12) {
			snapclient.SendMessage(`It's ${currentTImeInEST}\nGood morning ${message.author}!`);
		} else if (hours >= 12 && hours < 18) {
			snapclient.SendMessage(`It's ${currentTImeInEST}\nGood evening ${message.author}!`);
		} else if (hours >= 18 && hours < 23) {
			snapclient.SendMessage(`It's ${currentTImeInEST}\nGood night ${message.author}!`);
		}
		}
		
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
		
		if(message.author == "Me"){
			message.author = "NickAI";
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
				snapclient.SendMessage(`${message.cleanContent}`);
			}else if(message.author.username == "BabaAI"){
				snapclient.SendMessage(`𝐄𝐦𝐢𝐥𝐢𝐚𝐀𝐈: ${message.cleanContent}\n`);
			}else{
				snapclient.SendMessage(`${toUnicodeVariant(message.member.nickname || message.author.displayName, 'm')}(BOT): ${message.cleanContent}`);
			}
		}else{
			if(message.attachments.size > 0){
				const attachmentUrl = message.attachments.first().url;
				snapclient.SendMessage(` ‏‏‎ \n${toUnicodeVariant(message.member.nickname || message.author.displayName, 'm')}: ${attachmentUrl}\n ‏‏‎ `);
			}else{
				snapclient.SendMessage(` ‏‏‎ \n${toUnicodeVariant(message.member.nickname || message.author.displayName, 'm')}: ${message.cleanContent}\n ‏‏‎ `);
			}		
			//snapclient.SendMessage(sentdiscordmsg = `${toUnicodeVariant(message.member.nickname, 'b')}: ${message.cleanContent}`);
		}
		sentdiscordmsg = message.cleanContent;
		sentdiscordauthor = message.member.nickname || message.author.displayName;
		isDiscordmsg = true;
		
		
		//sentdiscordmsg = message.content;
	});
})();

client.login(config.token);

function getCurrentTimeInEST() {
  // Get current time in UTC
  const currentTimeUTC = DateTime.utc();

  // Convert to Eastern Time (EST)
  const currentTimeEST = currentTimeUTC.setZone("America/New_York");

  // Format as "hhmm"
  const formattedTime = currentTimeEST.toFormat("h:mm a");

  return formattedTime;
}

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
