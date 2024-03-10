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

type Operator = {
  id: string;
  displayName: string;
};

type ReportInfo = {
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
    const info: ReportInfo = {
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
          options: [
            {
              label: 'Thank You, Come Again - 4U Gas Station',
              value: 'gas-station',
            },
            {
              label: '23 Megabytes A Second - San Uriel Condominiums',
              value: 'streamer',
            },
            {
              label: ' Twisted Nerve - 213 Park Homes',
              value: 'meth-house',
            },
            {
              label: 'The Spider - Brixley Talent Time',
              value: 'talent-agency',
            },
            {
              label: `A Lethal Obsession - Sullivan's Slope`,
              value: 'aluminum-hat',
            },
            {
              label: 'Ides of March - Brisa Cove',
              value: 'veterans',
            },
            {
              label: 'Sinuous Trail - Mindjot Data Center',
              value: 'midjot',
            },
            {
              label: 'Ends of the Earth - Kawayu Beach',
              value: 'beach-house',
            },
            {
              label: 'Greased Palms - Los Sueños Postal Service',
              value: 'postal',
            },
            {
              label: 'Valley of the Dolls - Voll Health House',
              value: 'voll-house',
            },
            {
              label: 'Elephant - Watt Community College',
              value: 'columbine',
            },
            {
              label: 'Rust Belt - Costa Vino Border Reserve',
              value: 'mexico',
            },
            {
              label: 'Sins of the Father - Clemente Hotel',
              value: 'hotel',
            },
            {
              label: 'Neon Tomb - Neon Nightclub',
              value: 'ballad',
            },
            {
              label: `Buy Cheap, Buy Twice - Caesar's Car Dealership`,
              value: 'dealership',
            },
            {
              label: 'Carriers of the Vine - Cherryesa Farm',
              value: 'feminist-cult',
            },
            {
              label: 'Relapse - Coastal Grove Medical Center',
              value: 'hospital',
            },
            {
              label: 'Hide and Seek - Port Hokan: Peso 1',
              value: 'port',
            },
          ],
        }),
      ],
    });

    const mapSelectMessage = await interaction.reply({
      content: 'Informe o mapa da operação: ',
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
            content: `Mapa selecionado com sucesso!`,
            components: [modeSelectMenu],
          });
          break;

        case 'mode-select':
          info.mode = collectorInteraction.values[0];

          await collectorInteraction.update({
            content: `Modo selecionado com sucesso!`,
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
              content: `Comando informado com sucesso!`,
              components: [operatorsSelectMenu],
            });
          }
          break;

        case 'operators-select':
          {
            await collectorInteraction.values.forEach((id) => {
              const operator = guild?.members.cache.find(
                (member) => member.id === id,
              );

              if (operator) {
                info.operators.push({ id, displayName: operator.displayName });
              }
            });

            const modal = new ModalBuilder({
              custom_id: 'report-modal',
              title: `Relatório ${info.map} - ${new Date().toLocaleDateString('pt-BR')}`,
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
