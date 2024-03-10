import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder,
} from 'discord.js';

import { CommandDecorator } from '../CommandDecorator';
import { getMapName, maps } from 'src/utils/mapsUtils';

type Operator = {
  id: string;
  displayName: string;
};

type Report = {
  map: string;
  mode: string;
  command: string;
  operators: Operator[];
  comments: string;
};

@CommandDecorator
export class RelatorioCommand implements CommandInterface {
  props: CommandType = {
    name: 'relatorio',
    description: 'Envia o relátorio da missão ao comando da Elite BR',
    options: [
      {
        name: 'report-image',
        description: 'Imagem da nota final da missão.',
        type: ApplicationCommandOptionType.Attachment,
        required: true,
      },
    ],
  };

  async execute({ interaction, options }: CommandProps) {
    const info: Report = {
      map: '',
      mode: '',
      command: '',
      operators: [],
      comments: 'N/A',
    };

    const _reportImage = options.get('report-image');

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
        time: 30000,
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
              label: 'Rádio',
              value: 'radio',
            },
            {
              label: 'Arcade',
              value: 'arcade',
            },
          ],
        }),
      ],
    });

    const commandSelectMenu = new ActionRowBuilder<UserSelectMenuBuilder>({
      components: [
        new UserSelectMenuBuilder({
          custom_id: 'command-select',
          placeholder: 'Informe o comando da operação: ',
          min_values: 1,
          maxValues: 1,
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
            components: [commandSelectMenu],
          });
          break;

        case 'command-select':
          {
            const command = guild?.members.cache.find(
              (member) => member.id === collectorInteraction.values[0],
            );

            if (command) info.command = command.displayName;

            await collectorInteraction.update({
              components: [],
            });

            await collectorInteraction.editReply({
              components: [operatorsSelectMenu],
            });
          }
          break;

        case 'operators-select':
          {
            collectorInteraction.values.forEach((id) => {
              const operator = guild?.members.cache.find(
                (member) => member.id === id,
              );

              if (operator) {
                info.operators.push({ id, displayName: operator.displayName });
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
                      value: info.mode,
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
                      value: info.command,
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
                      value: info.comments,
                      required: false,
                    }),
                  ],
                }),
              ],
            });

            await collectorInteraction.showModal(modal);

            mapSelectCollector.stop();
          }
          break;
      }
    });
  }
}
