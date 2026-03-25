const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fermer')
    .setDescription('Fermer le ticket actuel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) { await this.closeTicket(interaction, client); },
  async handleButton(interaction, client) { await this.closeTicket(interaction, client); },

  async closeTicket(interaction, client) {
    const channel = interaction.channel;
    if (!channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Ce salon n\'est pas un ticket.', ephemeral: true });
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🔒 Ticket fermé')
      .setDescription(`Ticket fermé par <@${interaction.user.id}>.\nLe salon sera supprimé dans 5 secondes.`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    const logsChannel = interaction.guild.channels.cache.find(c => c.name === config.logsChannel);
    if (logsChannel) logsChannel.send({ embeds: [new EmbedBuilder().setColor('#FF0000').setTitle('🔒 Ticket fermé').addFields({ name: 'Salon', value: channel.name, inline: true }, { name: 'Fermé par', value: interaction.user.tag, inline: true }).setTimestamp()] });
    setTimeout(() => channel.delete().catch(() => {}), 5000);
  }
};
