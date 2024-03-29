import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import { EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';
import { getMemberNickname } from 'src/utils/nickname';

@CommandDecorator
export class DataCourses implements CommandInterface {
  props: CommandType = {
    name: 'cursos',
    description: 'Envia a enquete sobre a alteração da data dos cursos.',
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
      description: `Esta votação foi aberta com o objetivo de integrar recursos e se adequar às necessidades da comunidade.\n\n
        Vocês querem que os cursos complementares sejam alterados de Sexta-Feira para Quinta-Feira, os cursos básicos sejam alterados de Sábado para Sexta-Feira, Sábados sejam definidos para dia de operação especial e Domingo aplicação de exame teórico e entrevista com responsável por promoção de patente.
        `,
      footer: {
        text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}`,
      },
    });

    const infoChannel = interaction.guild?.channels.cache.get(
      interaction.channelId,
    ) as TextChannel;

    const message = await infoChannel.send({ embeds: [embed] });
    message.react('🟢').then(() => message.react('🔴'));
  }
}
