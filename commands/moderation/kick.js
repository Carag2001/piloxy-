const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre du serveur')
    .addUserOption(o => o.setName('membre').setDescription('Le membre à expulser').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du kick').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction, client) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: '❌ Je ne peux pas expulser ce membre.', ephemeral: true });
    await target.kick(raison);
    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('👢 Membre expulsé')
      .addFields(
        { name: 'Membre', value: `${target.user.tag}`, inline: true },
        { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true },
        { name: 'Raison', value: raison }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    const logsChannel = interaction.guild.channels.cache.find(c => c.name === config.logsChannel);
    if (logsChannel) logsChannel.send({ embeds: [embed] });
  }
};
