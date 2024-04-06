import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder,
} from 'discord.js';

import { CommandDecorator } from '../CommandDecorator';
import { getMapName, maps } from 'src/utils/mapsUtils';
import { getMemberNickname, splitNickNameRank } from 'src/utils/nickname';
import { colors } from 'src/utils/colors';
import { getCurrentTime } from 'src/utils/hours';

type Operator = {
  id: string;
  displayName: string;
};

type Report = {
  map: string;
  mode: string;
  command?: Operator;
  operators: Operator[];
  comments: string;
};

@CommandDecorator
export class RelatorioCommand implements CommandInterface {
  props: CommandType = {
    name: 'relatorio',
    description:
      'Envia o relátorio da missão ao comando do Ready or Not Brasil',
    options: [
      {
        name: 'report-image',
        description: 'Imagem da relatório final da missão.',
        type: ApplicationCommandOptionType.Attachment,
        required: true,
      },
    ],
    dmPermission: false,
  };

  async execute({ interaction, options }: CommandProps) {
    const info: Report = {
      map: '',
      mode: '',
      operators: [],
      comments: '',
    };

    // const reportImage = options.get('report-image');

    const reportImage = options.getAttachment('report-image');

    if (!reportImage) return;

    const mapSelectMenu = new ActionRowBuilder<StringSelectMenuBuilder>({
      components: [
        new StringSelectMenuBuilder({
          custom_id: 'map-select',
          placeholder: 'Selecione o mapa da missão.',
          min_values: 1,
          max_values: 1,
          options: [...maps],
        }),
      ],
    });

    const mapSelectMessage = await interaction.reply({
      content: 'Preencha as informações do relatório: ',
      components: [mapSelectMenu],
      ephemeral: true,
      fetchReply: true,
    });

    const mapSelectCollector = mapSelectMessage.createMessageComponentCollector(
      {
        time: 420000,
      },
    );

    const modeSelectMenu = new ActionRowBuilder<StringSelectMenuBuilder>({
      components: [
        new StringSelectMenuBuilder({
          custom_id: 'mode-select',
          placeholder: 'Informe o modo da operação: ',
          min_values: 1,
          max_values: 1,
          options: [
            {
              label: 'Tático',
              value: 'tatico',
            },
            {
              label: 'Milsim',
              value: 'milsim',
            },
          ],
        }),
      ],
    });

    const operatorsSelectMenu = new ActionRowBuilder<UserSelectMenuBuilder>({
      components: [
        new UserSelectMenuBuilder({
          custom_id: 'operators-select',
          placeholder: 'Informe os operadores presentes: ',
          min_values: 1,
          max_values: 12,
        }),
      ],
    });

    mapSelectCollector.on('collect', async (collectorInteraction) => {
      if (!collectorInteraction.isAnySelectMenu()) return;

      const { guild } = collectorInteraction;

      switch (collectorInteraction.customId) {
        case 'map-select':
          info.map = collectorInteraction.values[0];

          await collectorInteraction.update({
            components: [modeSelectMenu],
          });
          break;

        case 'mode-select':
          info.mode = collectorInteraction.values[0];

          await collectorInteraction.update({
            components: [operatorsSelectMenu],
          });
          break;

        case 'operators-select':
          {
            const command = guild?.members.cache.find(
              (member) => member.id === interaction.user.id,
            );

            if (!command) return;
            info.command = {
              id: command.id,
              displayName:
                splitNickNameRank(command)?.trim() || command.displayName,
            };

            collectorInteraction.values.forEach((id) => {
              const operator = guild?.members.cache.find(
                (member) => member.id === id,
              );

              if (operator) {
                info.operators.push({
                  id,
                  displayName:
                    splitNickNameRank(operator)?.trim() || operator.displayName,
                });
              }
            });

            const modal = new ModalBuilder({
              custom_id: 'report-modal',
              title: `${getMapName(info.map)} - ${new Date().toLocaleDateString('pt-BR')}`,
              components: [
                new ActionRowBuilder<TextInputBuilder>({
                  components: [
                    new TextInputBuilder({
                      custom_id: 'modal-mode-input',
                      label: 'Modo da operação: ',
                      placeholder: 'Informe o modo da operação: ',
                      style: TextInputStyle.Short,
                      value: info.mode == 'tatico' ? 'Tático' : 'Milsim',
                      required: true,
                    }),
                  ],
                }),
                new ActionRowBuilder<TextInputBuilder>({
                  components: [
                    new TextInputBuilder({
                      custom_id: 'modal-command-input',
                      label: 'Comando da operação: ',
                      placeholder: 'Informe o comando da operação: ',
                      style: TextInputStyle.Short,
                      value: info.command.displayName,
                      required: true,
                    }),
                  ],
                }),
                new ActionRowBuilder<TextInputBuilder>({
                  components: [
                    new TextInputBuilder({
                      custom_id: 'modal-operators-input',
                      label: 'Operadores: ',
                      placeholder: 'Informe os operadores: ',
                      style: TextInputStyle.Paragraph,
                      value: info.operators
                        .map((operator) => operator.displayName)
                        .join('\n'),
                      required: true,
                    }),
                  ],
                }),
                new ActionRowBuilder<TextInputBuilder>({
                  components: [
                    new TextInputBuilder({
                      custom_id: 'modal-comments-input',
                      label: 'Observações: ',
                      style: TextInputStyle.Paragraph,
                      value: '',
                      required: false,
                    }),
                  ],
                }),
              ],
            });

            await collectorInteraction.showModal(modal);

            const modalInteraction = await interaction
              .awaitModalSubmit({
                time: 420000,
                filter: (i) => i.user.id === interaction.user.id,
              })
              .catch((err) => {
                console.log(err);
                return null;
              });

            if (!modalInteraction) return;

            const { fields } = modalInteraction;

            const comments =
              fields.getTextInputValue('modal-comments-input') || 'N/A';

            const modalReply = await modalInteraction.reply({
              content: 'Seu formulario foi enviado com sucesso!',
              ephemeral: true,
            });

            await collectorInteraction.deleteReply();
            setTimeout(async () => {
              await modalReply.delete();
            }, 5000);

            const reportChannel = interaction.guild?.channels.cache.get(
              '1204127322027069481',
            ) as TextChannel;

            if (!reportChannel) return;

            const embed = new EmbedBuilder()
              .setColor(colors.BLUE)
              .setTitle(`Relatório da Missão`)
              .setDescription(
                `**${getMapName(info.map)}** - ${new Date().toLocaleDateString('pt-BR')} às ${getCurrentTime()}`,
              )
              .addFields(
                { name: 'Comando', value: `<@${info.command.id}>` },
                { name: ' ', value: ' ' },
                {
                  name: 'Operadores',
                  value: info.operators
                    .map((operator) => `<@${operator.id}>`)
                    .join('\n'),
                },
                { name: ' ', value: ' ' },
                {
                  name: 'Resumo/Observações',
                  value: comments,
                },
              )
              .setImage(reportImage.url as string)
              .setFooter({
                text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}}`,
              })
              .setTimestamp();

            await reportChannel.send({ embeds: [embed] });

            mapSelectCollector.stop();
          }
          break;
      }
    });
  }
}
