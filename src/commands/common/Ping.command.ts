import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

const execute = async (interaction: ChatInputCommandInteraction) => {
  const pingEmbed = new EmbedBuilder()
    .setColor(0xff00ff)
    .setTitle('Pong! 🏓')
    .setDescription(
      `**Latency** is \`${Date.now() - interaction.createdTimestamp}\` ms. \n**API Latency** is \`${Math.round(interaction.client.ws.ping)}\` ms`,
    )
    .setThumbnail(interaction.client.user.avatarURL()!)
    .setTimestamp()
    .setFooter({
      text: `Command by: ${interaction.user.tag}`,
      iconURL: interaction.client.user.avatarURL()!,
    });

  await interaction.reply({ embeds: [pingEmbed], ephemeral: true });
};

export default { data, execute };
