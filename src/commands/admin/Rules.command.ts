import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import { EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';
import { colors } from 'src/utils/colors';

@CommandDecorator
export class RuleCommand implements CommandInterface {
  props: CommandType = {
    name: 'regras',
    description: 'Envia as regras no canal onde o comando foi enviado',
    dmPermission: false,
  };

  async execute({ interaction }: CommandProps) {
    await interaction.deferReply({ ephemeral: true });

    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      return interaction.reply({
        content: 'Ou seu candango, tu não tem permissão de usar esse comando!',
      });
    }

    const rulesChannel = interaction.guild?.channels.cache.get(
      '1089618543504523304',
    ) as TextChannel;

    const serviceChannel = interaction.guild?.channels.cache.get(
      '1203804187050254418',
    ) as TextChannel;

    const rulesEmbed = new EmbedBuilder({
      color: colors.BLUE,
      title: 'Regras',
      thumbnail: {
        url: 'https://i.imgur.com/0hcmtif.jpeg',
      },
      description: `
        **1** - Tudo começa pelo respeito. Você deve respeitar todos os usuários, independentemente se gosta ou não deles. Trate os outros como você deseja ser tratado.\n
        **2** - Não toleramos comportamentos tóxicos ou desrespeitosos. Agir de forma xenofóbica, racista, homofóbica, sexista, difamatória ou caluniosa resultará em punição, banimento ou até mesmo processo judicial contra o infrator.\n
        **3** - Evite linguagem inapropriada. Qualquer tipo de palavra depreciativa ao se dirigir a um outro integrante é considerada um insulto e esta atitude não será tolerada dentro da comunidade.\n
        **4** - Não faça spam. Não envie muitas mensagens breves uma atrás da outra. Não atrapalhe o bom andamento das conversas fazendo spam.\n
        **5** - Não compartilhe material pornográfico, voltado para adultos (conteúdos gore ou afins), ou que seja NSFW. Conteúdos como este são estritamente proibidos.\n
        **6** - Não use nomes ou fotos de perfil ofensivos. Será pedido que você mude o nome ou foto se os moderadores considerarem que há algo inadequado.\n
        **7** - Realizar ameaças de “DDoS”, “doxxing”, chantagear e realizar qualquer tipo de ameaça ostensiva (como roubo de dados) a outros usuários ou a este servidor, e/ou compartilhar dados pessoais de outros integrantes é estritamente proibido e sujeita ao banimento do infrator.`,
      fields: [
        { name: ' ', value: ' ' },
        { name: ' ', value: ' ' },
        {
          name: 'Em caso de dúvidas:',
          value: `Abra um ticket em ${serviceChannel.toString()}`,
        },
      ],
      footer: {
        text: `Comando enviado por: ${interaction.user.displayName} - ${new Date().toLocaleDateString('pt-BR')}`,
      },
    });

    rulesChannel.send({ embeds: [rulesEmbed] });
  }
}
