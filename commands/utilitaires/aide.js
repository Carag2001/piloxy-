const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('aide').setDescription('Afficher toutes les commandes disponibles'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📖 Liste des commandes')
      .addFields(
        { name: '🛡️ Modération', value: '`/ban` `/kick` `/mute` `/warn`' },
        { name: '🎫 Tickets', value: '`/ticket` `/fermer`' },
        { name: '🔧 Utilitaires', value: '`/aide` `/userinfo` `/serverinfo`' }
      )
      .setFooter({ text: 'Bot Discord • Fait avec ❤️' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
