import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

@CommandDecorator
export class ReportCommand implements CommandInterface {
  props: CommandType = {
    name: 'report',
    description: 'Envia o relatório da missão.',
    options: [
      {
        name: 'report-image',
        description: 'Imagem da nota final da missão.',
        type: ApplicationCommandOptionType.Attachment,
        required: true,
      },
    ],
  };

  async execute({ interaction }: CommandProps) {
    if (!interaction.isChatInputCommand()) return;

    const reportImage = interaction.options.get('report-image');

    const reportEmbed = new EmbedBuilder()
      .setColor(0xff00ff)
      .setTitle('Nome da Missão')
      .setDescription(
        `Data: ${new Date().toLocaleDateString('pt-BR')}\nAo comando do EliteBR, envio de relatório referente a missão.`,
      )
      .addFields(
        { name: 'Comando', value: 'Nome do Comando' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Operadores', value: '.' },
        { name: '.', value: 'Nome dos Operadores', inline: true },
      )
      .setImage(reportImage?.attachment?.url as string)
      .setTimestamp();

    await interaction.reply({ embeds: [reportEmbed] });
  }
}
