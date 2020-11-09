const Discord = require('discord.js') // подключение библиотеки                  Видео про бота https://youtu.be/1lzPIhTaPDY
const client = new Discord.Client() // создание клиента

client.on('ready', () =>{ // ивент, когда бот запускается https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-ready
    client.generateInvite("ADMINISTRATOR").then(invite => console.log(`Ссылка на добавление ${invite}`))
    console.log(`Привет! ${client.user.tag} запустился!`) // информация в консоль про успешный запуск
})

client.on('message', message =>{ // ивент, когда приходит любое сообщение в чат https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
    if (message.author.bot) return; // если автор сообщения - бот, ничего не происходит 
    if (message.content == '!userinfo') { // если пользователь написал "!профиль" 
    let embed = new Discord.MessageEmbed() // создание ембед сообщения
    .setTitle(message.author.username) // в тайтле имя автора 
    let status = ''
    switch (message.author.presence.status) { // проверка статусов 
        case 'online':
            status = 'онлайн'; break; 
            case 'idle':
                status = ':orange_circle:нет на месте'; break;
                case 'offline':
                    status = 'нет в сети'; break;
                    case 'dnd':
                        status = ':red_circle:не беспокоить'; break;
    }
    embed.setDescription(`Ваш ID: **${message.author.id}**
    Статус: **${status}**
    Дата создания аккаунта: **${message.author.createdAt.toLocaleDateString()}**
    Дата захода на сервер: **${message.member.joinedAt.toLocaleDateString()}
    **`) // описание ембеда
    .setColor('RANDOM') // рандомный цвет ембеда
    .setThumbnail(message.author.avatarURL()) // вставляем в ембед аватарку пользователя
    message.channel.send(embed) // отправляем сообщение в канал где была написана команда   
    }
})

client.on('message', message =>{ // ивент, когда приходит любое сообщение в чат https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
    if (message.author.bot) return; // если автор сообщения - бот, ничего не происходит 
    if (message.content == '!serverinfo') { // если пользователь написал "!профиль" 
    let embed = new Discord.MessageEmbed() // создание ембед сообщения
	embed.setDescription(`На сервере **Game Over**, ты можешь играть в игры, получать роли, общаться в чате и многое, многое другое! Тебе тут понравится!`) // описание ембеда
    .setColor('RANDOM') // рандомный цвет ембеда
    message.channel.send(embed) // отправляем сообщение в канал где была написана команда
    }
})	

client.on('messageDelete', message =>{ // ивент, когда удаляется любое сообщение с сервера https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
    let embed = new Discord.MessageEmbed()
    .setTitle('Было удалено сообщение!')
    .setColor('RANDOM')
    .addField(`Удалённое сообщение:`, message.content, true)
    .addField("Автор:",`${message.author.tag} (${message.author})`,true)
    .addField("Канал:", `${message.channel}`, false)
    .setFooter(' - ',`${message.author.avatarURL()}`)
    .setTimestamp(message.createdAt);
  client.channels.cache.get("775330850660155403").send(embed); // айди вашего канала с логами
})

client.on('guildMemberAdd', member =>{ // ивент, когда пользователь присоединяется к серверу https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
    let embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Привет, ${member.user.username}!`)
    .setDescription(`**Ты попал на сервер Game Over!
    Ты наш \`${client.guilds.get("747702266848608346").memberCount}\` участник! **`) // айди вашего сервера               !!!!!!!!!!
    .setFooter('Будь всегда на позитиве :3', 'https://cdn.discordapp.com/emojis/590614597610766336.gif?v=1')
    // .addField(`Участвуй в розыгрышах!`, `<#773273340734865451>`, true) // Добавляйте свои каналы по желанию
    // .addField(`Общайся в чате!`, `<#7773554992749215794>`, true)
    // .addField(`Смотри видео наших ютуберов!`, `<#774295349031469096>`, true)
    .setColor('RANDOM')
    member.send(embed); // отправка сообщения в лс 

    let embed2 = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Пользователь вошел на сервер`)
    .addField('Пользователь:', member.user)
    .setColor('RANDOM')
    member.send(embed);
    client.channels.cache.get('775330850660155403').send(embed2) // айди вашего канала с логами
})

const yt = require('ytdl-core'); // Либы для плеера
const searchYoutube = require('youtube-api-v3-search');

var queue = {};

client.on('ready', () => {
	console.log('ready!');
});

client.on('message', msg => {
	if (!msg.content.startsWith(config.prefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0]](msg);
});

const commands = {
	'join': (msg) => {
		return new Promise((resolve, reject) => {
            const voiceChannel = msg.member.voice.channel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('Не могу присоединиться к твоему голосовому каналу.');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
        });
    },
	'add': (msg) => {
		let url = msg.content.split(' ')[1];
		if (url == '' || url === undefined) return msg.channel.send(`Необходимо добавить ссылку на YouTube видео или ID после ${config.prefix}add`);
		yt.getInfo(url, (err, info) => {
            if (err) {
                // Сообщение после команды !add
                var args = msg.content.slice(config.prefix.length).trim().split(" ");
                args.splice(0, 2);
                var mesg = args.join(" ");
                // Помещаем запрос в параметр для поиска
                var options = {
                    q: mesg,
                    part: 'snippet',
                    type: 'video'
                };
                // Сам поиск
                searchYoutube(config.youtube_api_key, options, function (err, result) {
                    if (err) {
                        console.log(err + " |-------|-------| " + JSON.stringify(info));
                    } else {
                        url = result.items[0].id.videoId;
                        yt.getInfo(url, (err, info) => {
                            if (!err) {
                                if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
                                queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
                                msg.channel.send("Добавлено в очередь: ```"+info.title+"```");
                            }
                        });
                    }
                });
            } else {
                if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
                queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
                msg.channel.send("Добавлено в очередь: ```"+info.title+"```");
            }
        });
    },
    'queue': (msg) => {
        if (queue[msg.guild.id] === undefined) return msg.channel.send(`Очередь пуста. Для добавления трека воспользуйся командой !add`);
        let tosend = [];
        queue[msg.guild.id].songs.forEach((song, i) => {
            tosend.push(`${i+1}. ${song.title} - Заказал: ${song.requester}`);
        });
        msg.channel.send(`__**${msg.guild.name} Муз. Очередь:**__ В данный момент **${tosend.length}** треков в очереди. ${(tosend.length > 10 ? '*[Показаны первые 10]*' : '')}\n\`\`\`${tosend.slice(0,10).join('\n')}\`\`\``);
    },
    'play': (msg) => {
        if (queue[msg.guild.id] === undefined) return msg.channel.send(`Очередь пуста. Для добавления трека воспользуйся командой !add`);
        if (msg.guild.voice == undefined || msg.guild.voice.channel == undefined || msg.guild.voice.connection == null) return commands.join(msg).then(() => commands.play(msg));
        if (queue[msg.guild.id].playing) return msg.channel.send('Уже играет');
        
		let dispatcher;
        queue[msg.guild.id].playing = true;
        
		(function play(song) {
            console.log(song.title);
			if (song === undefined) return msg.channel.send('Очередь пуста').then(() => {
				queue[msg.guild.id].playing = false;
				msg.member.voice.channel.leave();
            });
            msg.channel.send(`Играет: **${song.title}** по запросу от **${song.requester}**`);
            dispatcher = msg.guild.voice.connection.play(yt(song.url, {audioonly: true}), {passes : 4});

			let collector = msg.channel.createMessageCollector(m => m);
			collector.on('message', m => {
                if (m.content.startsWith(config.prefix + 'pause')) {
					m.channel.send('На паузе').then(() => {
                        dispatcher.pause();
                    });
				} else if (m.content.startsWith(config.prefix + 'resume')){
					m.channel.send('Проигрывание продолжается').then(() => {
						dispatcher.resume();
                    });
				} else if (m.content.startsWith(config.prefix + 'skip')){
					m.channel.send('Трек пропущен').then(() => {
                        dispatcher.end();
                    });
				} else if (m.content.startsWith('volume+')){
					if (Math.round(dispatcher.volume*50) >= 100) return m.channel.send(`Громкость: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					m.channel.send(`Громкость: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('volume-')){
					if (Math.round(dispatcher.volume*50) <= 0) return m.channel.send(`Громкость: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					m.channel.send(`Громкость: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(config.prefix + 'time')){
					m.channel.send(`Время: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
            });
            
			dispatcher.on('end', () => {
                play(queue[msg.guild.id].songs.shift());
                collector.stop();
			});
			dispatcher.on('error', (err) => {
				return msg.channel.send('Ошибка: ' + err).then(() => {
					play(queue[msg.guild.id].songs.shift());
					collector.stop();
				});
			});
        }) (queue[msg.guild.id].songs.shift());
    }
};

client.on('guildMemberRemove', member => { // ивент, когда пользователь выходит с сервера https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
    let embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.avatarURL())
    .setTitle(`Пользователь покинул сервер`)
    .addField('Пользователь:', member.user)
    .setColor('RANDOM')
    member.send(embed);
    client.channels.cache.get('775330850660155403').send(embed) // айди вашего канала с логами
  })
  
async function change() {
    let members = client.guilds.cache.get("747702266848608346").memberCount // сколько людей на сервере + указать айди своего сервера
    client.channels.cache.get("775442750367596585").setName(`🔥┋Участников: ${members}!`); // свой айди войса
}

var interval = setInterval(function () { change(); }, 5000  ); // время обновления в миллисекундах

client.login(process.env.BOT_TOKEN) // токен вашего бота

// Хотите, чтобы ваш бот работал 24/7 бесплатно? Смотрите это видео: https://www.youtube.com/watch?v=wxdl4QK0am4

// Bot by Sanich https://youtube.com/sanich - фишки, гайды по приложению Discord