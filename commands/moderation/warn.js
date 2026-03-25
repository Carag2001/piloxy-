const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');
const warnings = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre')
    .addUserOption(o => o.setName('membre').setDescription('Le membre à avertir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison');
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    const userId = target.user.id;
    if (!warnings.has(userId)) warnings.set(userId, []);
    warnings.get(userId).push({ raison, date: new Date(), mod: interaction.user.tag });
    const count = warnings.get(userId).length;
    const embed = new EmbedBuilder()
      .setColor('#FF8C00')
      .setTitle('⚠️ Avertissement')
      .addFields(
        { name: 'Membre', value: `${target.user.tag}`, inline: true },
        { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true },
        { name: 'Avertissements', value: `${count}`, inline: true },
        { name: 'Raison', value: raison }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    try { await target.user.send(`⚠️ Tu as reçu un avertissement sur **${interaction.guild.name}** : ${raison}`); } catch {}
    const logsChannel = interaction.guild.channels.cache.find(c => c.name === config.logsChannel);
    if (logsChannel) logsChannel.send({ embeds: [embed] });
  }
};
