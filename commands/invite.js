const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Lien d'invitation du bot.",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["inv"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `**Voici mes liens :** \n[[Lien d'invitation]](https://discord.com/oauth2/authorize?client_id=${
          client.botconfig.ClientID
        }&permissions=${
          client.botconfig.Permissions
        }&scope=bot%20${client.botconfig.Scopes.join("%20")}) \n[[Serveur Support]](https://discord.gg/Uh8Dc3KT2h)`
      );
    message.channel.send(embed);
  },
  
};
