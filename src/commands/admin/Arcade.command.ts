import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import { EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';
import { getMemberNickname } from 'src/utils/nickname';

@CommandDecorator
export class ArcadeCommand implements CommandInterface {
  props: CommandType = {
    name: 'arcade',
    description: 'Envia as diretrizes do arcade.',
    dmPermission: false,
  };

  async execute({ interaction }: CommandProps) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      return interaction.reply({
        content: 'Ou seu candango, tu não tem permissão de usar esse comando!',
      });
    }

    const embed = new EmbedBuilder({
      title: 'Diretrizes - Arcade',
      color: 0xc24611,
      description: `O modo Arcade ou Casual é destinado aos jogadores da comunidade que buscam uma experiência multiplayer divertida em Ready or Not. Se você busca uma partida para fazer amigos e jogarem de forma despretensiosa e divertida, este é o canal certo!\n`,
      fields: [
        { name: ' ', value: ' ' },
        { name: '**Mods**', value: ' ' },
        {
          name: ' ',
          value: `
          No modo Arcade todos os tipos de mods são liberados, divirta-se testando sua arma favorita, leve um tubarão de pelúcia nas costas ou empunhe seu escudo da Hello Kitty!`,
        },
      ],
      footer: {
        text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}`,
      },
    });

    const infoChannel = interaction.guild?.channels.cache.get(
      interaction.channelId,
    ) as TextChannel;

    await infoChannel.send({ embeds: [embed] });
  }
}
