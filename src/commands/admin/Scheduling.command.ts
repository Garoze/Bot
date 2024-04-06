import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  TextChannel,
} from 'discord.js';
import { colors } from 'src/utils/colors';
import { getMemberNickname } from 'src/utils/nickname';

@CommandDecorator
export class SchedulingCommand implements CommandInterface {
  props: CommandType = {
    name: 'agendar',
    description:
      'Envia uma mensagem de agendamento informando o usuário e horario.',
    dmPermission: false,
  };

  async execute({ interaction }: CommandProps) {
    const member = interaction.guild?.members.cache.find(
      (m) => m.id === interaction.user.id,
    );

    if (!member) {
      interaction.reply({
        content:
          'O membro citado não foi encontrado, informe o <@348557198676459520>.',
        ephemeral: true,
      });
    }

    const daySelectMenu = new ActionRowBuilder<StringSelectMenuBuilder>({
      components: [
        new StringSelectMenuBuilder({
          custom_id: 'day-select',
          min_values: 1,
          maxValues: 1,
          options: [
            {
              label: '04/04/2024 - 17:00 | Complementar 1° Oficial',
              value: '04-17:00-1089625597384339477',
              emoji: '⏰',
            },
            {
              label: '04/04/2024 - 18:00 | Complementar 2° Oficial',
              value: '04-18:00-1089622962342215724',
              emoji: '⏰',
            },
            {
              label: '04/04/2024 - 19:00 | Complementar 1° Oficial',
              value: '04-19:00-1089625597384339477',
              emoji: '⏰',
            },
            {
              label: '04/04/2024 - 20:00 | Complementar 2° Oficial',
              value: '04-20:00-1089622962342215724',
              emoji: '⏰',
            },
            {
              label: '04/04/2024 - 21:00 | Complementar 1° Oficial',
              value: '04-21:00-1089625597384339477',
              emoji: '⏰',
            },
            {
              label: '04/04/2024 - 22:00 | Complementar 2° Oficial',
              value: '04-22:00-1089622962342215724',
              emoji: '⏰',
            },
          ],
        }),
      ],
    });

    const daySelectMessage = await interaction.reply({
      content: 'Informe o dia e horário para os complementares: ',
      components: [daySelectMenu],
      ephemeral: true,
      fetchReply: true,
    });

    const daySelectCollector = daySelectMessage.createMessageComponentCollector(
      {
        time: 60000,
      },
    );

    daySelectCollector.on('collect', async (dayInteraction) => {
      if (!dayInteraction.isAnySelectMenu()) return;

      switch (dayInteraction.customId) {
        case 'day-select':
          {
            const courseChannel = interaction.guild?.channels.cache.get(
              '1225191186558357637',
            ) as TextChannel;

            if (!courseChannel) return;

            const info = dayInteraction.values[0];

            const courses =
              info.split('-')[2] == '1089625597384339477'
                ? '<@&1162837253219950722>\n<@&1159899636044144710>'
                : '<@&1159899891443695686>\n<@&1113630247477313596>\n<@&1176875517752909824>\n<@&1176881097347453018>\n<@&1176877809038278757>';

            const embed = new EmbedBuilder({
              color: colors.BLUE,
              title: 'Agendamento - Cursos complementares',
              description: 'Pedido de agendamento de cursos complementares.',
              fields: [
                { name: ' ', value: ' ' },
                {
                  name: 'Operador',
                  value: `<@${interaction.user.id}>`,
                },
                { name: ' ', value: ' ' },
                {
                  name: 'Data/Horário',
                  value: `04/04/2024 - ${info.split('-')[1]}`,
                },
                { name: ' ', value: ' ' },
                { name: 'Cursos', value: courses },
              ],
              timestamp: new Date(),
              footer: {
                text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}`,
              },
            });

            await interaction.deleteReply();
            await courseChannel.send({ embeds: [embed] });

            daySelectCollector.stop();
          }
          break;
      }
    });
  }
}
