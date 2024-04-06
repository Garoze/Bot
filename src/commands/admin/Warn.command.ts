import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';
import { CommandDecorator } from '../CommandDecorator';
import {
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  PermissionsBitField,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { colors } from 'src/utils/colors';
import { getMemberNickname } from 'src/utils/nickname';

@CommandDecorator
export class WarnCommand implements CommandInterface {
  props: CommandType = {
    name: 'aviso',
    description: 'Envia um aviso no canal onde o comando foi enviado.',
    dmPermission: false,
  };

  async execute({ interaction }: CommandProps) {
    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.Administrator,
      )
    ) {
      return interaction.reply({
        content: 'Ou seu candango, tu não tem permissão de usar esse comando!',
      });
    }

    const modal = new ModalBuilder({
      custom_id: 'warn-modal',
      title: 'Enviar Aviso',
      components: [
        new ActionRowBuilder<TextInputBuilder>({
          components: [
            new TextInputBuilder({
              custom_id: 'warn-modal-title',
              label: 'Título: ',
              style: TextInputStyle.Short,
              required: true,
            }),
          ],
        }),
        new ActionRowBuilder<TextInputBuilder>({
          components: [
            new TextInputBuilder({
              custom_id: 'warn-modal-text',
              label: 'Texto do warn: ',
              style: TextInputStyle.Paragraph,
              required: true,
            }),
          ],
        }),
      ],
    });

    await interaction.showModal(modal);

    const modalInteraction = await interaction
      .awaitModalSubmit({
        time: 120000,
        filter: (i) => i.user.id === interaction.user.id,
      })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!modalInteraction) return;

    const { fields } = modalInteraction;

    const title = fields.getTextInputValue('warn-modal-title');
    const text = fields.getTextInputValue('warn-modal-text');

    const message = await modalInteraction.reply({
      content: 'Seu formulario foi enviado com sucesso!',
      ephemeral: true,
    });

    const currentChannel = interaction.guild?.channels.cache.get(
      interaction.channelId,
    ) as TextChannel;

    const embed = new EmbedBuilder({
      color: colors.YELLOW,
      title: title,
      fields: [
        { name: ' ', value: ' ' },
        { name: ' ', value: text },
      ],
      footer: {
        text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}`,
      },
      timestamp: new Date(),
    });

    await currentChannel.send({ embeds: [embed] });
    await message.delete();
  }
}
