const { Util, MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "play",
  description: "Lance une musique souhaiter.",
  usage: "[Titre de la musique]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["p"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **vous devez être dans un salon vocal pour utiliser cette commande.**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Vous devez être dans le même salon vocal que moi pour utiliser cette commande.**"
      );
    let SearchString = args.join(" ");
    if (!SearchString)
      return client.sendTime(
        message.channel,
        `**Utilisation - **\`${GuildDB.prefix}play [musique]\``
      );
    let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
    let Searching = await message.channel.send(":mag_right: `Recherche...`");
    if (!CheckNode || !CheckNode.connected) {
      return client.sendTime(
        message.channel,
        "❌ | **Lavalink node pas connecter.**"
      );
    }
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: client.botconfig.ServerDeafen,
      volume: client.botconfig.DefaultVolume,
    });

    let SongAddedEmbed = new MessageEmbed().setColor(
      client.botconfig.EmbedColor
    );

    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Rien n'est joué en ce moment...**"
      );

    if (player.state != "CONNECTED") await player.connect();

    try {
      if (SearchString.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken();
        let node = client.Lavasfy.nodes.get(client.botconfig.Lavalink.id);
        let Searched = await node.load(SearchString);

        if (Searched.loadType === "PLAYLIST_LOADED") {
          let songs = [];
          for (let i = 0; i < Searched.tracks.length; i++)
            songs.push(TrackUtils.build(Searched.tracks[i], message.author));
          player.queue.add(songs);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play();
          SongAddedEmbed.setAuthor(
            `File d'attente mit à la suite`,
            message.author.displayAvatarURL()
          );
          SongAddedEmbed.addField(
            "En file d'attente",
            `\`${Searched.tracks.length}\` musique.`,
            false
          );
          //SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
          Searching.edit(SongAddedEmbed);
        } else if (Searched.loadType.startsWith("TRACK")) {
          player.queue.add(
            TrackUtils.build(Searched.tracks[0], message.author)
          );
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          SongAddedEmbed.setAuthor(`Ajouter à la file d'attente ⌛​`);
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
          );
          SongAddedEmbed.addField(
            "Auteur",
            Searched.tracks[0].info.author,
            true
          );
          //SongAddedEmbed.addField("Duration", `\`${prettyMilliseconds(Searched.tracks[0].length, { colonNotation: true })}\``, true);
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              "Position dans la file d'attente",
              `${player.queue.size - 0}`,
              true
            );
          Searching.edit(SongAddedEmbed);
        } else {
          return client.sendTime(
            message.channel,
            "**Pas de musique trouver pour - **" + SearchString
          );
        }
      } else {
        let Searched = await player.search(SearchString, message.author);
        if (!player)
          return client.sendTime(
            message.channel,
            "❌ | **Rien n'est joué en ce moment...**"
          );

        if (Searched.loadType === "NO_MATCHES")
          return client.sendTime(
            message.channel,
            "**Pas de musique trouver pour - **" + SearchString
          );
        else if (Searched.loadType == "PLAYLIST_LOADED") {
          player.queue.add(Searched.tracks);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play();
          SongAddedEmbed.setAuthor(
            `Playlist ajouter à la file d'attente ⌛​`
          );
          // SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.playlist.name}](${SearchString})`
          );
          SongAddedEmbed.addField(
            "En file d'attente",
            `\`${Searched.tracks.length}\` musique.`,
            false
          );
          SongAddedEmbed.addField(
            "Durée de la playlist",
            `\`${prettyMilliseconds(Searched.playlist.duration, {
              colonNotation: true,
            })}\``,
            false
          );
          Searching.edit(SongAddedEmbed);
        } else {
          player.queue.add(Searched.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          SongAddedEmbed.setAuthor(`Ajouter à la file d'attente ⌛​`);

          // SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`
          );
          SongAddedEmbed.addField("Auteur", Searched.tracks[0].author, true);
          SongAddedEmbed.addField(
            "Durée",
            `\`${prettyMilliseconds(Searched.tracks[0].duration, {
              colonNotation: true,
            })}\``,
            true
          );
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              "Position dans la file d'attente",
              `${player.queue.size - 0}`,
              true
            );
          Searching.edit(SongAddedEmbed);
        }
      }
    } catch (e) {
      console.log(e);
      return client.sendTime(
        message.channel,
        "**Pas de musique trouver pour - **" + SearchString
      );
    }
  },

  
};
