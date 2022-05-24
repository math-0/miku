const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "pause",
  description: "Met en pause la musique.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
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
    if (player.paused)
      return client.sendTime(
        message.channel,
        "❌ | **La musique est deja en pause.**"
      );
    player.pause(true);
    let embed = new MessageEmbed()
      .setAuthor(`⏸️ | Musique mise en pause !`)
      .setColor(client.botconfig.EmbedColor)
      .setDescription(`\`${GuildDB.prefix}resume\` pour continuer la lecture.`);
    await message.channel.send(embed);
    await message.react("✅");
  },

  
};
