require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes, EmbedBuilder, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ]
});
client.commands = new Collection();
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
const allCommands = [];
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
    allCommands.push(command.data.toJSON());
  }
}
client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  client.user.setActivity('votre serveur 👀', { type: ActivityType.Watching });
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: allCommands });
    console.log('✅ Slash commands enregistrées !');
  } catch (error) {
    console.error(error);
  }
});
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      const msg = { content: '❌ Une erreur est survenue.', ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
      else await interaction.reply(msg);
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === 'close_ticket') {
      const closeTicket = require('./commands/tickets/close');
      await closeTicket.handleButton(interaction, client);
    }
  }
});
client.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.cache.find(c => c.name === config.welcomeChannel);
  if (!channel) return;
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle(`👋 Bienvenue sur ${member.guild.name} !`)
    .setDescription(`Bienvenue <@${member.id}> ! Tu es le **${member.guild.memberCount}ème** membre.`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();
  channel.send({ embeds: [embed] });
});
client.on('guildMemberRemove', async member => {
  const channel = member.guild.channels.cache.find(c => c.name === config.welcomeChannel);
  if (!channel) return;
  channel.send(`👋 **${member.user.tag}** a quitté le serveur. Bonne continuation !`);
});
const token = process.env.TOKEN;
console.log('Token détecté:', token ? 'OUI' : 'NON');
client.login(token);
```

**Ensuite dans le CMD :**
```
```
```
node index.js
