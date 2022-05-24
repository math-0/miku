const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "remove",
  description: `Supprimer une musique de la file d'attente.`,
  usage: "[Numéro de la musique]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["rm"],

  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.players.get(message.guild.id);
    const song = player.queue.slice(args[0] - 1, 1);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Rien n'est joué en ce moment...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Vous devez être dans un salon vocal pour utiliser cette commande.**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Vous devez être dans le même salon vocal que moi pour utiliser cette commande.**"
      );

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send("Il n'y a rien à supprimer dans la file d'attente.");
    let rm = new MessageEmbed()
      .setDescription(
        `✅ | **Musique** \`${Number(args[0])}\` **supprimer de la file d'attente !**`
      )
      .setColor("GREEN");
    if (isNaN(args[0]))
      rm.setDescription(
        `**Utilisation - **${client.botconfig.prefix}\`remove [numéro musique]\``
      );
    if (args[0] > player.queue.length)
      rm.setDescription(`La file d'attente a seulement ${player.queue.length} musique.`);
    await message.channel.send(rm);
    player.queue.remove(Number(args[0]) - 1);
  },

  
};
