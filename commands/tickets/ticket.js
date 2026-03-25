const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ouvrir un ticket de support'),

  async execute(interaction, client) {
    const guild = interaction.guild;
    const user = interaction.user;
    const existing = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
    if (existing) return interaction.reply({ content: `❌ Tu as déjà un ticket ouvert : ${existing}`, ephemeral: true });

    let category = guild.channels.cache.find(c => c.name === config.ticketCategory && c.type === ChannelType.GuildCategory);
    const ticketChannel = await guild.channels.create({
      name: `ticket-${user.username.toLowerCase()}`,
      type: ChannelType.GuildText,
      parent: category?.id,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
      ]
    });

    const modRole = guild.roles.cache.find(r => r.name === config.modRole);
    if (modRole) await ticketChannel.permissionOverwrites.create(modRole, { ViewChannel: true, SendMessages: true });

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🎫 Ticket de support')
      .setDescription(`Bonjour <@${user.id}> ! Notre équipe va te répondre rapidement.\n\nExplique ton problème en détail ci-dessous.`)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('close_ticket').setLabel('Fermer le ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
    );

    await ticketChannel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Ton ticket a été créé : ${ticketChannel}`, ephemeral: true });

    const logsChannel = guild.channels.cache.find(c => c.name === config.logsChannel);
    if (logsChannel) logsChannel.send({ embeds: [new EmbedBuilder().setColor('#5865F2').setTitle('🎫 Nouveau ticket').addFields({ name: 'Utilisateur', value: user.tag }, { name: 'Salon', value: `${ticketChannel}` }).setTimestamp()] });
  }
};
