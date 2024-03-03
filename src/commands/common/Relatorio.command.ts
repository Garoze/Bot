import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  Collection,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import { BotClient } from 'src/client/Client';

@CommandDecorator
export class RelatorioCommand implements CommandInterface {
  props: CommandType = {
    name: 'relatorio',
    description: 'Envia o relátorio da missão ao comando da EliteBR',
    options: [
      {
        name: 'report-image',
        description: 'Imagem da nota final da missão.',
        type: ApplicationCommandOptionType.Attachment,
        required: true,
      },
    ],
    selects: new Collection([
      [
        'map-select',
        async (interaction) => {
          const map = interaction.values[0];

          BotClient.getSingleton().selectedMap = map;

          interaction
            .reply({
              content: `Mapa selecionado: ${map}`,
              ephemeral: true,
            })
            .then(() => setTimeout(() => interaction.deleteReply(), 3000));
        },
      ],
    ]),
  };

  async execute({ interaction }: CommandProps) {
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

    const reportImage = interaction.options.get('report-image');

    const embed = new EmbedBuilder()
      .setColor(0xff00ff)
      .setTitle(interaction.client.selectedMap || 'Missão')
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

    await interaction
      .reply({
        components: [mapSelectMenu],
        ephemeral: true,
        fetchReply: true,
      })
      .then(() => {
        setTimeout(async () => {
          interaction.deleteReply();
          await interaction.followUp({
            embeds: [embed],
          });
        }, 3000);
      });
  }
}
