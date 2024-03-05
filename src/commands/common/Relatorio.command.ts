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

type ReportInfo = {
  map: string;
  mode: string;
  command: string;
  operators: string[];
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
      operators: [''],
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

    // interaction.deferReply({ fetchReply: true, ephemeral: true });

    const mapSelectMessage = await interaction.reply({
      content: 'Informe o mapa da operação: ',
      components: [mapSelectMenu],
      ephemeral: true,
      fetchReply: true,
    });

    const mapSelectCollector = mapSelectMessage.createMessageComponentCollector(
      {
        time: 10000,
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

    const modal = new ModalBuilder({
      custom_id: 'report-modal',
      title: `Relatório ${info.map} - ${new Date().toLocaleDateString('pt-BR')}`,
    });

    const modeInput = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          custom_id: 'modal-mode-input',
          label: 'Modo da operação: ',
          placeholder: 'Informe o modo da operação: ',
          style: TextInputStyle.Short,
          value: info.mode,
        }),
      ],
    });

    const commandInput = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          custom_id: 'modal-command-input',
          label: 'Comando da operação: ',
          placeholder: 'Informe o comando da operação: ',
          style: TextInputStyle.Short,
          value: info.command,
        }),
      ],
    });

    const operatorsInput = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          custom_id: 'modal-operators-input',
          label: 'Operadores: ',
          placeholder: 'Informe os operadores: ',
          style: TextInputStyle.Paragraph,
          value: info.operators
            .map((operator) => `${options.getUser(operator)}`)
            .join('\n'),
        }),
      ],
    });

    const commentsInput = new ActionRowBuilder<TextInputBuilder>({
      components: [
        new TextInputBuilder({
          custom_id: 'modal-comments-input',
          label: 'Observações: ',
          style: TextInputStyle.Paragraph,
          value: info.comments,
        }),
      ],
    });

    modal.setComponents(modeInput, commandInput, operatorsInput, commentsInput);

    mapSelectCollector.on('collect', async (collectorInteraction) => {
      if (!collectorInteraction.isAnySelectMenu()) return;

      switch (collectorInteraction.customId) {
        case 'map-select':
          info.map = collectorInteraction.values[0];

          collectorInteraction.update({
            content: `Mapa selecionado com sucesso!`,
            components: [modeSelectMenu],
          });
          break;

        case 'mode-select':
          info.mode = collectorInteraction.values[0];

          collectorInteraction.update({
            content: `Modo selecionado com sucesso!`,
            components: [commandSelectMenu],
          });
          break;

        case 'command-select':
          info.command = collectorInteraction.values[0];

          collectorInteraction.update({
            content: `Comando informação com sucesso!`,
            components: [operatorsSelectMenu],
          });
          break;

        case 'operators-select':
          info.operators = collectorInteraction.values;

          console.log(info);

          collectorInteraction.update({
            content: `Operadores informados com sucesso!`,
          });

          collectorInteraction.deleteReply();

          mapSelectCollector.stop();
          break;
      }
    });

    // TODO: Find a way to show the modal
    await interaction.showModal(modal);
  }
}

// Fluxo do comando de relatorio
// digita /relatorio com uma imagem X
// seleciona o mapa da missão X
// seleciona o comando
// selecionar os operadores
// abre o modal para preencher as observações
// envia
