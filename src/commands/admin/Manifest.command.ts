import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import { EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';
import { getMemberNickname } from 'src/utils/nickname';

@CommandDecorator
export class ManifestCommand implements CommandInterface {
  props: CommandType = {
    name: 'manifesto',
    description: 'Envia o manifesto do servidor no canal.',
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
      title: 'Manifesto',
      color: 0x61da2d,
      description: `Somos uma comunidade não oficial dedicada ao público brasileiro do jogo Ready or Not.\n
      Iniciamos nossa jornada como comunidade no mês de Março do ano de 2023, momento em que o Ready or Not se encontrava em seu estágio de acesso antecipado, e desde então nos dedicamos diariamente a expandir nossa comunidade, para abranger diversos estilo de jogo e suprir as vontades de diversos estilos de jogadores.\n
      Nossa comunidade é pautada por regras, para o bom convívio social e gerida por uma equipe admnistrativa composta por: Moderadores, Suportes e Instrutores.  Somos recrutadores certificados pela VOID Interactive (desenvolvedora do jogo) para atuar dentro da comunidade oficial do Ready or Not, com intuito de convidar brasileiros e falantes da lingua portuguesa para fazerem parte da comunidade e apresentar o jogo para novos jogadores.\n
      Fazemos o que fazemos porque gostamos muito do jogo. Ready or Not oferece uma experiência sem igual para o usuário que gosta de jogos táticos, e poder dividir esse momento com pessoas que gostam deste mesmo estilo de jogo torna tudo muito mais divertido, pois afinal, o entretenimento é a real e final proposta de um vídeo-game.`,
      footer: {
        text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}`,
      },
    });

    const infoChannel = interaction.guild?.channels.cache.get(
      interaction.channelId,
    ) as TextChannel;

    await infoChannel.send({ embeds: [embed] });
  }
}

// /^Ready or Not$/i
