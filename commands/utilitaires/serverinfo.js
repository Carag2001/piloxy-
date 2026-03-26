const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Afficher les informations du serveur'),
  async execute(interaction) {
    const guild = interaction.guild;
    await guild.members.fetch();
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`🏠 ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: 'ID', value: guild.id, inline: true },
        { name: 'Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Membres', value: `${guild.memberCount}`, inline: true },
        { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
