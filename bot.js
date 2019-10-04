const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);


const Discord = require('discord.js');
const { Client, Util} = require('discord.js');
const config = require("./config.json");
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const client = new Client({ disableEveryone: true});

const Enmap = require("enmap");
const fs = require("fs");
const jimp =require("jimp")
const bot = new Discord.Client();
const db = require('node-json-db');
bot.request = require("request")
bot.moment = require("moment")
bot.URL = require("url")
let xp = require("./xp.json");


//message.channel.send('Verifique suas mensagens privadas ✔️').then(msg => msg.delete(4000));

client.config = config;


//handlers
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});
client.commands = new Enmap();
fs.readdir("./comandos/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./comandos/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});
client.commands = new Enmap();
fs.readdir("./staff/", (err, files) => {

  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./staff/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

//LABNEGRO
client.on('guildCreate', guild => {
  const moment = require('moment') //npm i moment
   let canal = client.channels.get('527173228641255434')
   let embedentrada = new Discord.RichEmbed()
   .setTitle(`**Acabei de entrar num servidor!** \ <@409710803550208000>\ `)
   .addField(`**<a:sim:482171966833426432>Nome do servidor:**`, `\`${guild.name}\`` )
   .addField(`**<:servers:627614948914102288>:Id do servidor:**`, `\`${guild.id}\``, true)
   .addField('**<:members:627614889288138765>Membros:**', `\`${guild.memberCount}\``, true)
   .addField('**<a:carrega:627616622596587570>Região do servidor:**', `\`${guild.region}\``, true)
   .addField('**<a:dono:624778478440677391>Dono:**', `${guild.owner}`, true)
   .addField('**<a:masi:478003266815262730>Id do dono:**', `\`${guild.ownerID}\``, true)
   .addField('**<a:hd:471788546466775061>Criado em:**', `\`${moment.utc(guild.createdAt).format('lll')}\``, true)
   .setTimestamp()
   .setColor('RANDOM')

   canal.send(embedentrada)
});


bot.on('guildMemberAdd', member => {
  let channel = member.guild.channels.find('name', 'channel.name');
  let memberavatar = member.user.avatarURL
      if (!channel) return;
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(memberavatar)
      .addField('Bem vindo!', `${member}`, true)
      .addField('Temos atualmente: ', `${member.guild.memberCount} pessoas no server.`, true)
      .addField("Nome", `<@` + `${member.id}` + `>`, true)
      .addField('Servidor', `${member.guild.name}`, true )
      .setFooter(`**${member.guild.name}**`)
      .setTimestamp()

      channel.sendEmbed(embed);
});

client.on('typingStart', (channel, user) => {
 let canal = client.channels.get('629787819388305434')
  let embedsda = new Discord.RichEmbed()
      .setDescription(`${user.username} está escrevendo no ${channel.name}`)
 canal.send(embedsda);
  
});
 bot.on("message", async message => {


  

  let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);

  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 300;
  xp[message.author.id].xp =  curxp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
    let lvlup = new Discord.RichEmbed()
    .setTitle("Level Up!")
    .addField("New Level", curlvl + 1);

    message.channel.send(lvlup).then(msg => {msg.delete(5000)});
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
  });

  
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});

const youtube = new YouTube(config.GOOGLE_API_KEY);
const PREFIX = config.prefix;

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('I am ready!'));

client.on('disconnect', () => console.log('I disconnected!'));

client.on('reconnecting', () => console.log('I am disconnecting!'));

client.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  const serverQueue = queue.get(oldMember.guild.id);


  if(oldUserChannel === undefined && newUserChannel !== undefined) {
      // User joines a voice channel
  } else if(newUserChannel === undefined){

    // User leaves a voice channel
      if(oldMember.id === '589157409285472366'){
          return console.log("BOT");
      }
      else{
          if(client.guilds.get(oldMember.guild.id).voiceConnection != null){
              if(client.guilds.get(oldMember.guild.id).voiceConnection.channel.id === oldUserChannel.id){
                    if(oldUserChannel.members.size < 2){
                        serverQueue.songs = [];
                        serverQueue.connection.dispatcher.end('No members left in the channel!')
                    }    
              }else{
                  return console.log('not in the same voice channel');
              }
          }else{
              return undefined;
          }
      }
         

  }
})

client.on('message', async msg => { // eslint-disable-line
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;
    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1];
    const serverQueue = queue.get(msg.guild.id);
    
    if(msg.content.startsWith(`${PREFIX}play`)){
        const voiceChannel = msg.member.voiceChannel;
        if(!voiceChannel){
            var embedplay1 = new Discord.RichEmbed()
                .setTitle(`**Por favor se conecte a um canal de voz**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedplay1);
        }
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if(!permissions.has('CONNECT')){
            var embedplay2 = new Discord.RichEmbed()
                .setTitle(`**Não posso me conectar a esse canal!**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedplay2);
        }
        if (!permissions.has('SPEAK')){
            var embedplay3 = new Discord.RichEmbed()
                .setTitle(`**Eu não posso falar nesse canal.**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedplay3);
        }
        
        if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for(const video of Object.values(videos)){
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, msg, voiceChannel, true);
            }
            var embedplay4 = new Discord.RichEmbed()
                .setTitle(`**Playlist: ${playlist.title} queued!**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedplay4);
        }else{
            try{
                var video = await youtube.getVideo(url);
            }catch(error){
                try{
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    var embedqueue5 = new Discord.RichEmbed()
                        .setTitle(`__**Musicas encontradas com esse titulo:**__`)
                        .setDescription(`
${videos.map(video2 => `**${++index}-** ${video2.title}`).join('\n')}
**Por favor selecione um numero de 1 a 10!**`)
                .setColor([226, 50, 41])
                    msg.channel.sendEmbed(embedqueue5);
                    
                    try{
                       var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                           maxMatches: 1,
                           time: 10000,
                           errors: ['time']
                       }); 
                    }catch(err){
                        console.error(err);
                        var embedplay6 = new Discord.RichEmbed()
                            .setTitle(`**Você demorou ou digitou um numero invalido**`)
                            .setColor([226, 50, 41])
                        return msg.channel.sendEmbed(embedplay6);
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                }catch(err){
                    console.error(err);
                    var embedplay7 = new Discord.RichEmbed()
                        .setTitle(`**I could find no video!**`)
                        .setColor([226, 50, 41])
                    return msg.channel.sendEmbed(embedplay7);
                }
            }
            return handleVideo(video, msg, voiceChannel);
        }
    
    } else if(msg.content.startsWith(`${PREFIX}pular`)) {
        if(!msg.member.voiceChannel){
           var embedskip1 = new Discord.RichEmbed()
                .setTitle(`**Você não está em um canal de voz!**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedskip1); 
        }
        if(!serverQueue){
            var embedskip2 = new Discord.RichEmbed()
                .setTitle(`**Não ha nada para pular**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedskip2);
        }
        serverQueue.connection.dispatcher.end('Skip command has been used!');
        var embedskip3 = new Discord.RichEmbed()
            .setTitle(`**Musica pulada com sucesso!**`)
            .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedskip3);
    }   
        
     else if (msg.content.startsWith(`${PREFIX}parar`)){
        if(!msg.member.voiceChannel){
           var embedstop1 = new Discord.RichEmbed()
                .setTitle(`**Você não está em um canal de voz**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedstop1); 
        }
        if(!serverQueue){
            var embedstop2 = new Discord.RichEmbed()
                .setTitle(`**Não há nada para parar!**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedstop2);
        }
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Stop command has been used!');
        var embedstop3 = new Discord.RichEmbed()
            .setTitle(`**A musica foi parada.**`)
            .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedstop3);
    }
    else if(msg.content.startsWith(`${PREFIX}som`)){
        if(!serverQueue){
            var embedsong1 = new Discord.RichEmbed()
                .setTitle(`**Não está tocando nenhuma musica.**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedsong1);
                 }
            var embedsong2 = new Discord.RichEmbed()
                .setTitle(`__**${serverQueue.songs[0].title}**__`)
                .setThumbnail(serverQueue.songs[0].thumbnail)
                .setDescription(`
Canal: ${serverQueue.songs[0].channel}
Duração: ${serverQueue.songs[0].duration}
Link: ${serverQueue.songs[0].url}
`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedsong2); 
    }
    else if(msg.content.startsWith(`${PREFIX}volume`)){
        if(!serverQueue){
            var embedvolume1 = new Discord.RichEmbed()
                .setTitle(`**Não está tocando nenhuma musica no momento!**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedvolume1);}
        if(!args[1]){
             var embedvolume2 = new Discord.RichEmbed()
                .setTitle(`**Volume atual é de: ${serverQueue.volume}**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedvolume2);
        }
        
        if(args[1]>0){
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolume(args[1] / 2000);
        serverQueue.mute = false;
        var embedvolume3 = new Discord.RichEmbed()
                .setTitle(`**Volume alterado para: ${args[1]} **`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedvolume3);
        } else{
            var embedvolume4 = new Discord.RichEmbed()
                .setTitle(`**Por favor use: e+volume 0 a 1000**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedvolume4);
        }
    }
    else if(msg.content.startsWith(`${PREFIX}lista`)){
        if(!serverQueue){
            var embedqueue1 = new Discord.RichEmbed()
                .setTitle(`**Nenhuma musica foi adicionada na lista**`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedqueue1);
        }
        var embedqueue2 = new Discord.RichEmbed()
                .setTitle(`__**Musicas adicionadas**__`)
                .setDescription(`
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Playing:** ${serverQueue.songs[0].title}`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedqueue2);
    }
    else if(msg.content.startsWith(`${PREFIX}pausar`)){
        if(serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        var embedpause1 = new Discord.RichEmbed()
                .setTitle(`**A musica foi pausada**`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedpause1);
        }
        var embedpause2 = new Discord.RichEmbed()
            .setTitle(`**A musica ja esta pausada**`)
            .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedpause2);
    }
    else if(msg.content.startsWith(`${PREFIX}retomar`)){
        if(serverQueue && !serverQueue.playing){
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        var embedresume1 = new Discord.RichEmbed()
                .setTitle(`**Musica retomada com sucesso**`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedresume1);           
        }
        var embedresume2 = new Discord.RichEmbed()
            .setTitle(`**A music**`)
            .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedresume2);
    }   
    else if(msg.content.startsWith(`${PREFIX}mute`)){
        if(!serverQueue){
        var embedmute1 = new Discord.RichEmbed()
                .setTitle(`**O bot não está tocando nada no momento**`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedmute1);     
        }
        if(serverQueue.mute){
        var embedmute2 = new Discord.RichEmbed()
                .setTitle(`**O bot ja está mutado**`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedmute2);     
        }
        else{
            serverQueue.mute = true;
            serverQueue.connection.dispatcher.setVolume(0 / 2000);
            var embedmute3 = new Discord.RichEmbed()
                .setTitle(`**O bot foi mutado com sucesso**`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedmute3);
        }
    }
    else if(msg.content.startsWith(`${PREFIX}unmute`)){
        if(!serverQueue){
            var embedunmute1 = new Discord.RichEmbed()
                .setTitle(`**O bot não está tocando nada no momento!**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedunmute1);     
        }
        if(!serverQueue.mute){
            var embedunmute2 = new Discord.RichEmbed()
                .setTitle(`**O bot ja foi desmutado**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedunmute2);     
        }   
        else{
            serverQueue.mute = false;
            serverQueue.connection.dispatcher.setVolume(serverQueue.volume / 2000);
            var embedunmute3 = new Discord.RichEmbed()
                .setTitle(`**Bot desmutado com sucesso**`)
                .setColor([226, 50, 41])
        return msg.channel.sendEmbed(embedunmute3);
        }
    }
    else if(msg.content.startsWith(`${PREFIX}musica`)){
        var embedhelp = new Discord.RichEmbed()
            .setTitle(`__**Comandos musicas.**__`)
            .addField("e+play <musica> [Link YouTube/Playlist]", "Uso: `e+play` toca a musica que você quer ouvir", false)
            .addField("e+parar", "Uso: `e+parar` para a `lista` de musicas atual", false)
            .addField("e+pular", "Uso: `e+pular` pula a musica atual.", false)
            .addField("e+som", "Uso: `e+som` Veja a musica atual.", false)
            .addField("e+lista", "Uso: `e+lista` Veja a lista de musicas adicionadas a faixa", false)
            .addField("e+volume", "Uso: `e+volume` Ajuste o volume da musica.", false)
            .addField("e+pausar", "Uso: `e+pausar` Pausa a lista de musica.", false)
            .addField("e+retomar", "Uso: `e+retomar` Retoma a lista de musica.", false)
            .addField("e+mute", "Uso: `e+mute` Muta o bot no canal.", false)
            .addField("e+unmute", "Uso: `e+unmute` Desmuta o bot no canal", false)
            .setColor([226, 50, 41])
            .setThumbnail(client.user.avatarURL)
            return msg.channel.sendEmbed(embedhelp);
    }
    return undefined;
});


async function handleVideo(video, msg, voiceChannel, playlist=false){
    const serverQueue = queue.get(msg.guild.id);
    
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail: video.thumbnails.default.url,
        channel: video.channel.title,
        duration: `${video.duration.hours}hrs : ${video.duration.minutes}min : ${video.duration.seconds}sec`
    };
    if(!serverQueue){
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            mute: false,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try{
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        }catch(error){
            console.log(error);
            queue.delete(msg.guild.id);
            var embedfunc1 = new Discord.RichEmbed()
                .setTitle(`**Bot could not VoiceChannel the joinen!**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedfunc1);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if(playlist) return undefined;
        else{
            var embedfunc2 = new Discord.RichEmbed()
                .setTitle(`**${song.title} queued!**`)
                .setColor([226, 50, 41])
            return msg.channel.sendEmbed(embedfunc2);
        }
    }    
    return undefined;
}

function play(guild, song){
    const serverQueue = queue.get(guild.id);
    
    if(!song){
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);
    
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                if(reason === 'Stream is not generating quickly enough.') console.log('Song ended');
                else console.log(reason);
                serverQueue.songs.shift();
                setTimeout(() => {
                play(guild, serverQueue.songs[0]);
                }, 250);
            })
            .on('error', error => console.log(error)); 
            
    dispatcher.setVolume(serverQueue.volume / 2000);
    
    var embedfunction1 = new Discord.RichEmbed()
                .setTitle(`** Tocando ${song.title} .\n** __Aviso:__ **A musica foi iniciada com o volume em 100!**`)
                .setColor([226, 50, 41])
            return serverQueue.textChannel.sendEmbed(embedfunction1);
}

client.login(config.token);
