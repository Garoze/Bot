import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import { EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';

@CommandDecorator
export class HourCommand implements CommandInterface {
  props: CommandType = {
    name: 'horas',
    description:
      'Envia a enquete sobre as horas para aplicação de cursos e afins.',
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
      title: 'Datas importantes da comunidade',
      description: `Quais horários vocês têm disponibilidade para participar destas atividades mencionadas?\n\n
      🌅 9:00 as 11:00\n
      🌄 13:00 as 15:00\n
      🌆 17:00 as 19:00\n
      🌃 21:00 as 23:00\n
      🌑 01:00+\n`,
      footer: {
        text: `Comando enviado por: ${interaction.user.displayName} - ${new Date().toLocaleDateString('pt-BR')}`,
      },
    });

    const infoChannel = interaction.guild?.channels.cache.get(
      interaction.channelId,
    ) as TextChannel;

    const message = await infoChannel.send({ embeds: [embed] });
    message
      .react('🌅')
      .then(() => message.react('🌄'))
      .then(() => message.react('🌆'))
      .then(() => message.react('🌃'))
      .then(() => message.react('🌑'));
  }
}
