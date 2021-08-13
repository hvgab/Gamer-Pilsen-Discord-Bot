

const { default: axios } = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const Discord = require("discord.js");
const config = require("../config.json");
const { makeTable } = require("../libs/utils");
const { get } = require("https");

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

maps = [
  {
    id: 1,
    name: "Dust2",
    category: 1
  }, {
    id: 2,
    name: "Inferno",
    category: 1
  }, {
    id: 3,
    name: "Nuke",
    category: 1
  }, {
    id: 4,
    name: "Overpass",
    category: 1
  }, {
    id: 5,
    name: "Mirage",
    category: 1
  }, {
    id: 6,
    name: "Cache",
    category: 2
  }, {
    id: 7,
    name: "Cobblestone",
    category: 2
  }, {
    id: 8,
    name: "Train",
    category: 1
  }, {
    id: 9,
    name: "Tuscan",
    category: 2
  }, {
    id: 10,
    name: "Season",
    category: 2
  }, {
    id: 11,
    name: "Santorini",
    category: 2
  }, {
    id: 12,
    name: "Aztec",
    category: 3
  }, {
    id: 13,
    name: "Dust",
    category: 3
  }, {
    id: 14,
    name: "Fire",
    category: 3
  }, {
    id: 15,
    name: "Mill",
    category: 3
  }, {
    id: 16,
    name: "Prodigy",
    category: 3
  }, {
    id: 17,
    name: "Piranesi",
    category: 3
  }, {
    id: 18,
    name: "Vertigo",
    category: 1
  }, {
    id: 19,
    name: "Dust2 (old)",
    category: 4
  }, {
    id: 20,
    name: "Inferno (old)",
    category: 4
  }, {
    id: 21,
    name: "Nuke (old)",
    category: 4
  }, {
    id: 22,
    name: "Cobblestone (old)",
    category: 4
  }, {
    id: 23,
    name: "Train (old)",
    category: 4
  }, {
    id: 24,
    name: "Office",
    category: 5
  }, {
    id: 25,
    name: "Assault (1.6)",
    category: 5
  }, {
    id: 26,
    name: "Italy",
    category: 5
  }, {
    id: 27,
    name: "Insertion",
    category: 5
  }, {
    id: 28,
    name: "Agency",
    category: 5
  }, {
    id: 29,
    name: "Militia",
    category: 5
  }, {
    id: 30,
    name: "Estate (1.6)",
    category: 5
  }, {
    id: 31,
    name: "Subzero",
    category: 2
  }, {
    id: 32,
    name: "Cache (workshop)",
    category: 2
  }, {
    id: 33,
    name: "Aim map",
    category: 6
  }, {
    id: 34,
    name: "Ancient",
    category: 1
  }, {
    id: 35,
    name: "Dr Pepper Wingman",
    category: 7
  }, {
    id: 36,
    name: "Aim Esportal",
    category: 6
  }, {
    id: 37,
    name: "Aim Monster",
    category: 6
  }, {
    id: 38,
    name: "OMEN Astralis Wingman",
    category: 7
  }]

class Command {
  constructor(message, args) {
    this.message = message;
    this.args = args;

    this.interval;

    this.bot_message = null;

    this.regex = /https:\/\/esportal.com\/gather\/(\d+)/;
    this.gather_id;
    this.gather;
    this.match;
    this.state;
    this.team1_score;
    this.team2_score;

    this.embed
    this.waitTime = 15 * 1000
  }


  async execute() {
    // Get gather id
    let gather_id_match = this.message.content.match(this.regex);
    this.gather_id = gather_id_match[1];

    console.log("gather_id_match: " + gather_id_match)
    console.log("this.gather_id: " + this.gather_id)

    this.interval = setInterval(() => {
      this.bot_message = this.main();
    }, this.waitTime);
  }

  stopInterval() {
    clearInterval(this.interval);
  }


  async main() {

    // Get gather
    console.log(`GetGather id ${this.gather_id}`);
    this.gather = await this.getGather(this.gather_id);
    if (this.gather == undefined) {
      console.log("No gather, not doing anything more.")
      this.stopInterval()
      return
    }

    // Get match
    if (this.gather.hasOwnProperty('match_id') && this.gather.match_id !== null) {
      console.log(`Match id ${this.gather.match_id}`);
      this.match = await this.getMatch(this.gather.match_id);
    }

    // Make reply/embed
    this.embed = this.makeEmbed(this.gather, this.match);

    // If we are editing
    if (this.msg != null) {
      await this.msg.edit({ embed: this.embed })
    } else {
      this.msg = await this.message.channel.send({ embed: this.embed });
    }

    // Stop
    if (this.state == 'FINISHED') {
      this.stopInterval()
    }


  }

  async getGather(gather_id) {
    /* Get Gather info from Esportal.com/gather/[id] */
    console.log("Get Gather");
    let url = "https://api.esportal.com/gather/get?id=" + gather_id

    try {
      const response = await axios.get(url);
      // console.log(`response: ${response}`)
      const data = await response.data;
      return data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        return
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
      throw new Error('No gather')
    }
  };

  async getMatch() {
    /* Get esportal.com match data */

    console.log("Get Match");
    let url = "https://api.esportal.com/match/get?_=" + Date.now() + "&id=" + this.gather.match_id;
    console.log(url);

    try {
      const response = await axios.get(url);
      // console.log(`response: ${response}`);
      const data = await response.data;
      return data;
    } catch (error) {
      console.log("Error", error);
    }
  };

  makeEmbed() {
    if (this.gather == null) {
      console.log("no gather data.");
      return;
    }

    console.log("Make Embed:")

    // Get Gather State
    this.state = "UNKNOWN";

    if (this.gather.active === false && this.gather.match_id === null) {
      this.state = 'WAITING'
    }
    else if (this.gather.active === true && this.gather.match_id !== null) {
      this.state = 'IN-GAME'
    }
    else if (this.gather.active === false && this.gather.match_id !== null) {
      this.state = 'FINISHED'
    }
    console.log('State: ' + this.state)

    // Title + URL
    let title = this.gather.name;
    let url = "https://esportal.com/gather/" + this.gather_id

    // Author
    let author_name = "GP-Botten@Esportal.com"
    let author_icon = 'https://gamerpilsen.no/wp-content/uploads/2020/11/LOGO.png'
    // let author_url = 'https://gabbeh.no/gp-bot'

    // players
    let players = []
    let players_picked = []
    let players_team1 = []
    let players_team2 = []
    let team1_leader = "1"
    let team2_leader = "2"
    let team1_score;
    let team2_score;
    if (this.state == 'WAITING') {
      this.gather.players.forEach(player => {
        players.push(player)
        if (player.picked === true) {
          players_picked.push(player)
        }
        // players.push(player.username)
      })
    } else if (this.state == 'IN-GAME' || this.state == 'FINISHED') {
      this.match.players.forEach(player => {
        // if (player.)
        if (player.team == 1) {
          players_team1.push(player)
        } else if (player.team == 2) {
          players_team2.push(player)
        }
      })
    }

    // Score
    if (this.state == 'IN-GAME' || this.state == 'FINISHED') {
      console.log("adding team scores")
      team1_score = this.match.team1_score
    } else if (this.gather.team1_score !== null) {
      team1_score = this.gather.team1_score
    }

    if (this.state == 'IN-GAME' || this.state == 'FINISHED') {
      team2_score = this.match.team2_score
    } else if (this.gather.team2_score !== null) {
      team2_score = this.this.gather.team2_score
    }

    // Map
    let map = null
    if (this.state == 'IN-GAME' || this.state == 'FINISHED') {
      map = this.findMap(this.match.map_id)
      console.log(`match map id: ${this.match.map_id}`)
      console.log(`map: ${map}`)
    }

    // Traffic Light
    let traffic_light = ":white_circle:";
    if (this.state == 'WAITING') {
      let traffic_light = ':green_circle:'   // kom join
    }
    else if (this.state == 'IN-GAME') {
      let traffic_light = ':yellow_circle:'  // in-game
    }
    else if (this.state == 'FINISHED') {
      let traffic_light = ':red_circle:'     // match + gather er over
    }

    // Summary
    let summary = ""
    switch (this.state) {
      case 'WAITING':
        summary = ":green_circle: **Waiting for players** :green_circle:"
          + `\n\nCome join us! ${players_picked.length}/10\n`
        break;
      case 'IN-GAME':
        summary = `:yellow_circle: **Match in progress on ${map}** :yellow_circle:`
          + `\n\nTeam ${team1_leader} ( **${team1_score}** - **${team2_score}** ) Team ${team2_leader}\n`
        break;
      case 'FINISHED':
        summary = `:red_circle: **Match finished on ${map}** :red_circle:`
          + `\n\nTeam ${team1_leader} ( **${team1_score}** - **${team2_score}** ) Team ${team2_leader}\n`
        break;
      default:
        summary = ":white_circle: **UNKNOWN** :white_circle:"
        break;
    }

    // Body Text
    console.log(this.gather.players_picked);
    let body_text = "";
    let player_list = [];
    if (this.state == 'WAITING') {
      // create player list for ascii table
      // player_list = []
      for (let index = 0; index < players_picked.length; index++) {
        const player = players_picked[index];
        if (index < 5) {
          player_list.push([player.username])
        } else if (index >= 5) {
          player_list[index - 5].push(player.username)
        }
      }

      // every row has to have the same amount of data
      player_list.forEach(row => {
        if (row.length < 2) {
          row.push("")
        }
      });

      player_list.unshift(["", ""])
      console.log("player_list")
      console.log(player_list)

      // make ascii table
      let table = makeTable(player_list, null)

      // body text
      body_text = "```" + table + "```"
    } else if (this.state == 'IN-GAME' || this.state == 'FINISHED') {

      // create player list for ascii table
      // player_list = []
      players_team1 = []
      players_team2 = []

      // Sort into teams
      for (let index = 0; index < this.match.players.length; index++) {
        const player = this.match.players[index];
        if (player.team == 1) {
          players_team1.push(player)
        } else if (player.team == 2) {
          players_team2.push(player)
        }
      }

      // Merge arrays
      for (let index = 0; index < 5; index++) {
        console.log("pt1: " + players_team1[index])
        console.log("pt2: " + players_team1[index])
        player_list.push([players_team1[index].username, players_team2[index].username])
      }
      player_list.unshift(["Team 1", "Team 2"])

      console.log("Player list to makeTable:")
      console.log(player_list)

      // make ascii table
      let table = makeTable(player_list, null)

      // body text
      body_text = "```" + table + "```"
    } else {
      body_text = "```\n```"
    }


    let description = summary + "\n" + body_text;

    const embed = new Discord.MessageEmbed()
      .setColor(config.colors.gp_orange)
      .setTitle(title)
      .setURL(url)
      .setAuthor(author_name, author_icon, author_url)
      .setDescription(description)
      .setFooter("Last update")
      .setTimestamp();

    console.log("Embed:", embed);

    // Set image and thumbnail/icon
    /* let mapconfig = mapsconfig.find(
      (mapconfig) => mapconfig.name == server.map
    );
    if (mapconfig) {
      embed.setThumbnail(mapconfig.icon);
      embed.setImage(mapconfig.img);
    } */
    return embed;
  };

  findMap(id) {
    let map_name;
    console.log("find map")
    maps.forEach(map => {
      console.log(`map: `)
      console.log(map)
      console.log(`map.id ${map.id} : id ${id}`)
      console.log(map.id == id)
      if (map.id == id) {
        map_name = map.name
      }
    });
    return map_name
  }

}

module.exports = {
  name: "esportal_gather",
  regex: /https:\/\/esportal.com\/gather\/(\d+)/,
  // regex: "https://esportal.com/gather/(\d+)",
  // regex: '.*https://esportal.com/gather/(\d+).*',
  args: false,
  hidden: true,
  command: Command
}
