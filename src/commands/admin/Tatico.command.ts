import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import { EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';
import { getMemberNickname } from 'src/utils/nickname';
import { colors } from 'src/utils/colors';

@CommandDecorator
export class TaticoCommand implements CommandInterface {
  props: CommandType = {
    name: 'tatico',
    description: 'Envia as diretrizes do tático.',
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
      title: 'Diretrizes - Tático',
      color: colors.BLUE,
      description: `O modo Tático é destinado aos jogadores que buscam uma experiência tática dentro da comunidade. O objetivo do modo Tático é, acima de tudo, reunir aqueles que buscam este estilo de jogo, para atuar de forma coordenada e concluir com êxito a missão.\n
      Para jogar no modo tático, o jogador deve se formar no curso básico, elaborado por nós e oferecido de forma gratuita para todos que o desejam realizar.\n
      O curso básico é ministrado somente por um Instrutor certificado pela comunidade e tem o intuito de demonstrar ao interessado as técnicas, táticas e procedimentos básicos de combate confinado utilizados por nós, com base em uma doutrina real de combate confinado. Ao se formar no curso básico, o operador terá acesso às salas destinadas ao modo de jogo tático e poderá desfrutar de um sistema hierárquico completo voltado a aprendizagem e evolução do jogador.\n\n\n
      `,
      fields: [
        { name: ' ', value: ' ' },
        { name: ' ', value: ' ' },
        { name: '**Conhecendo as salas**', value: ' ' },
        {
          name: ' ',
          value: `

          **Briefing**: A sala de briefing é a sala de espera para aqueles que querem jogar no modo tático.\n
          **Tático 01**: Esta sala é destinada aos operadores com patente de Oficial Superior ou maior patente. Operadores de menor patente podem se conectar, porém não terão permissão para falar ou jogar dentro deste canal.\n
          **Tático 02**: Esta sala é destinada aos operadores com patente Cadete ou maior.
          **Tático 03**: Esta sala é destinada aos operadores com patente Cadete ou maior.
          **Tático 04**: Esta sala é destinada aos operadores com patente Cadete ou maior.\n\n`,
        },
        { name: ' ', value: ' ' },
        { name: '**Equipamentos**', value: ' ' },
        {
          name: ' ',
          value: `
          No modo tático proibimos o uso de alguns equipamentos, e restringimos outros.\n
          **Proibidos**: Mirrorgun, Door Wedge (cunha/aparador de porta).
          **Restritos**: Equipamento primário menos letal restrito a 2 por esquadrão completo.`,
        },
        { name: ' ', value: ' ' },
        { name: '**Mods**', value: ' ' },
        {
          name: ' ',
          value:
            'O uso de modificações no modo de jogo tático é liberado para todos, desde que o mod não afete, altere ou interfira em objetivos de missões e/ou interfiram na natureza e proposta do jogo e desta diretriz. Portanto, mods que desarmam bombas, eliminam oponentes ou que identifiquem oponentes através de paredes e superfícies são veementemente proibidos. Ao ser identificado, o infrator e todos aqueles que estavam presentes serão punidos.',
        },
        { name: ' ', value: ' ' },
        {
          name: ' ',
          value:
            '*Verifique se o Instrutor do seu curso básico possui de fato a tag de Instrutor em seu perfil. Todo nosso material didático foi elaborado pensando no uso nesta comunidade e para esta comunidade, e vale ressaltar, que não cobramos por isto. Se você identificar algum membro cobrando por qualquer tipo de conhecimento dentro desta comunidade, denuncie!',
        },
      ],
      footer: {
        text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}`,
      },
    });

    const currentChannel = interaction.guild?.channels.cache.get(
      interaction.channelId,
    ) as TextChannel;

    await currentChannel.send({ embeds: [embed] });
  }
}
