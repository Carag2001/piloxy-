const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Rendre muet un membre')
    .addUserOption(o => o.setName('membre').setDescription('Le membre à muter').setRequired(true))
    .addIntegerOption(o => o.setName('duree').setDescription('Durée en minutes').setRequired(false))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getMember('membre');
    const duree = interaction.options.getInteger('duree') || 10;
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    await target.timeout(duree * 60 * 1000, raison);
    const embed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setTitle('🔇 Membre mis en sourdine')
      .addFields(
        { name: 'Membre', value: `${target.user.tag}`, inline: true },
        { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true },
        { name: 'Durée', value: `${duree} minute(s)`, inline: true },
        { name: 'Raison', value: raison }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    const logsChannel = interaction.guild.channels.cache.find(c => c.name === config.logsChannel);
    if (logsChannel) logsChannel.send({ embeds: [embed] });
  }
};
