import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import { EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';
import { getMemberNickname } from 'src/utils/nickname';

@CommandDecorator
export class MessageCommand implements CommandInterface {
  props: CommandType = {
    name: 'message',
    description: 'Envias as informações de como agendar cursos complementares.',
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
      color: 0x13f01b,
      title: 'Como agendar um curso básico',
      description:
        'Para agendar um curso básico, basta digitar o comando `/agendar` e escolha os complementares e horários disponíveis.',
      timestamp: new Date(),
      footer: {
        text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}`,
      },
    });

    const infoChannel = interaction.guild?.channels.cache.get(
      interaction.channelId,
    ) as TextChannel;

    const message = await infoChannel.send({ embeds: [embed] });
    await message.react('✅');
  }
}
