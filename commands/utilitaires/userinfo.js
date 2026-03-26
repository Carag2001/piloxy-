const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Afficher les informations d\'un membre')
    .addUserOption(o => o.setName('membre').setDescription('Le membre').setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getMember('membre') || interaction.member;
    const user = target.user;
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Surnom', value: target.nickname || 'Aucun', inline: true },
        { name: 'Compte créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: 'A rejoint le', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: 'Rôles', value: target.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => `<@&${r.id}>`).join(', ') || 'Aucun' }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
