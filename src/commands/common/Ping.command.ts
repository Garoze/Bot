import { EmbedBuilder } from 'discord.js';
import { CommandDecorator } from '../CommandDecorator';
import { CommandInterface, CommandProps } from 'src/@types/command';

@CommandDecorator
export class Ping implements CommandInterface {
  props = {
    name: 'ping',
    description: 'Pong!',
  };

  execute({ interaction }: CommandProps) {
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

    interaction.reply({ embeds: [pingEmbed], ephemeral: true });
  }
}
