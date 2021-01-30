
const axios = require('axios');
const { stripIndent } = require('common-tags');
const JSAsciiTable = require('../libs/js-ascii-table.js');
const telialigaenconfig = require('./telialigaen.json');
const { prefix } = require('../config.json')
const telialigaenTabellerGP = require('../libs/telialigaen_tab_gp_await.js');
const { sendErrorToDev } = require('../libs/utils.js');

module.exports = {
	name: 'Telialigaen',
	description: stripIndent`
	Telialigen info.
	\`${prefix}telialigaen tabeller\` - alle tabeller hvor GP er med kommer på dm.
	\`${prefix}telialigaen tabeller gp\` - minitabell for alle GP lagene.
	\`${prefix}telialigaen tabeller team <lagnavn>\` - divisjonstabellen til <lagnavn>
	`,
	aliases: ['telia', 'ligaen', 'tl'],
	args:true,
	arguments: ['tabeller'], //, 'terminliste', 'resultater', 'lagene'],
	// usage: 
	
	execute(message, args) {
		
		// !TELIALIGAEN TABELLER
		if (
			args.length >= 1
			&& ['TABELLER', 'TAB', 'T'].includes(args[0].toUpperCase())
			) {
				
				// !TELIALIGAEN TABELLER GP
				if ( args.length >= 2 && args[1].toUpperCase() == 'GP' ) {
						
					telialigaenTabellerGP.main()
					.then(function(asciiTable){
						return message.channel.send(`\`\`\`${asciiTable}\`\`\``, {split:true});
					})
					.catch(function(error){
						console.error(error);
						sendErrorToDev(message, error, message.client);
						message.reply('I made a boo-boo')
					});
				}
					
					// !TELIALIGAEN TABELLER TEAM <LAGNAVN>
					
					else if (
						args.length >= 3
						&& args[1].toUpperCase() == 'TEAM'
						) {
							
							
							const tables_url = 'https://www.telialigaen.no/api/tables?division&season=8595';
							const msg = [];
							const tables = [];
							
							const TEAM_NAME = args[2];
							
							axios.get(tables_url)
							.then( function(response) {
								console.debug('Got axios data for tables.')
								
								const table_data = [
									[
										// 'Divisjon', 
										'#', 
										'Lag', 
										'Spilt', 
										'Vunnet', 
										'Uavgjort', 
										'Tapt',
										'+/-',
										'Straff',
										'Bonus',
										'Poeng', 
									],
								];
								let division_name = "";
								let gp_name = "";
								let found_team = false;
								
								// console.log(divisions);
								divisions = response.data;
								for (const division of divisions) {
									console.log(`Looping division: ${division['name']}`);
									for (const signup of division['signups']) {
										console.log(`Looping signups: ${signup['participant']['name']}`);
										if (signup['participant']['name'].toUpperCase().includes(TEAM_NAME.toUpperCase())
										|| (TEAM_NAME.toUpperCase() == 'GP' && signup['participant']['name'].toUpperCase() == 'Gamer-Pilsen'.toUpperCase())) {
											
											found_team = true;
											
											console.debug(`Found ${signup['participant']['name']} in ${division['name']}`);
											division_name = division['name'];
											gp_name = signup['participant']['name'];
											
											// do for loop again?
											for (const signup of division['signups']) {
												signupData = [
													// division['name'],
													signup['placement'].toString(),
													signup['participant']['name'],
													signup['played'].toString(),
													signup['wins'].toString(),
													signup['draws'].toString(),
													signup['losses'].toString(),
													`${signup['scoreFor']}/${signup['scoreAgainst']}`,
													signup['penalty'].toString(),
													signup['bonus'].toString(),
													signup['points'].toString(),
													// signup['status'],
												];
												table_data.push(signupData);
												console.debug(`Pushed signupdata for ${signup['participant']['name']} to table_data`);
											}
											
											// Make table
											console.log('Making ascii table');
											console.log(`table_data: \n ${table_data}`);
											var table_options = {
												title: `Telialigaen - ${division_name} - ${gp_name}`,
												spreadsheet: false,
												header: true,
												align: true,
												padding: 1,
												theme: JSAsciiTable.JSAsciiTable.getThemes()[1].value
												// theme: AsciiTable.getThemes()[0].value // // 0='MySQL' / 1='Unicode' / 2='Oracle'
											};
											console.log(`table_options: \n ${table_options}`);
											var table = new JSAsciiTable.JSAsciiTable(table_data, table_options);
											var ascii = table.render();
											console.log(ascii);
											// tables.push(ascii);
											console.log('Made table');
											
											message.channel.send(`\`\`\`${ascii}\`\`\``, {split:true});
											console.log('Message sent. Sending return');
											return
										}
									}
								}
								message.reply(`Fant ikke ${TEAM_NAME}`);
							})
							.catch( function (error){
								console.error(error);
								return message.channel.send(`Error: ${error}`);
							});
						}
						
						// !TELIALIGAEN TABELLER (alle tabeller med gp)
						else if (
							args.length == 1 
							&& args[0].toUpperCase() == 'TABELLER') {
								
								const tables_url = 'https://www.telialigaen.no/api/tables?division&season=8595';
								
								axios.get(tables_url)
								.then( function(response) {
									console.debug('Got axios data for tables.')
									
									message.reply(`${message.author}, for å unngå spam får du alle tabellene med Gamer-Pilsen på PM.`);
									
									const divisions = response.data;
									// console.log(divisions);
									for (const division of divisions) {
										
										let table_data = [
											[
												// 'Divisjon', 
												'#', 
												'Lag', 
												'Spilt', 
												'Vunnet', 
												'Uavgjort', 
												'Tapt',
												'+/-',
												'Straff',
												'Bonus',
												'Poeng', 
											],
										];
										let division_name = "";
										let gp_name = "";
										
										
										console.log(`Looping division: ${division['name']}`);
										for (const signup of division['signups']) {
											// console.log(`Looping signups: ${signup['participant']['name']}`);
											if ( signup['participant']['name'].toLowerCase().includes('gamer-pilsen') ) {
												
												console.debug(`Found ${signup['participant']['name']} in ${division['name']}`);
												division_name = division['name'];
												gp_name = signup['participant']['name'];
												
												// GP is in division, make table.
												for (const signup of division['signups']) {
													signupData = [
														// division['name'],
														signup['placement'].toString(),
														signup['participant']['name'],
														signup['played'].toString(),
														signup['wins'].toString(),
														signup['draws'].toString(),
														signup['losses'].toString(),
														`${signup['scoreFor']}/${signup['scoreAgainst']}`,
														signup['penalty'].toString(),
														signup['bonus'].toString(),
														signup['points'].toString(),
														// signup['status'],
													];
													table_data.push(signupData);
													// console.debug(`Pushed signupdata for ${signup['participant']['name']} to table_data`);
												}
												
												// Making table
												console.log('Making ascii table');
												// console.log(`table_data: \n ${table_data}`);
												var table_options = {
													title: `${gp_name}   -   ${division_name}`,
													spreadsheet: false,
													header: true,
													align: true,
													padding: 1,
													theme: JSAsciiTable.JSAsciiTable.getThemes()[1].value
													// theme: AsciiTable.getThemes()[0].value // // 0='MySQL' / 1='Unicode' / 2='Oracle'
												};
												
												// console.log(`table_options: \n ${table_options}`);
												var table = new JSAsciiTable.JSAsciiTable(table_data, table_options);
												var ascii = table.render();
												// console.log(ascii);
												// tables.push(ascii);
												console.log('Made table');
												
												message.author.send(`\`\`\`${ascii}\`\`\``, {split:true});
											}
										}
									} // Done looping
									console.log('Done looping');
									console.log('Message sent. Sending return');
									return
								})
								.catch( function (error){
									console.error(error);
									return message.channel.send(`Error: ${error}`);
								});
							}
							else {
								return message.client.commands.get('help').execute(message, [this.name]);
							}
						} else {
							return message.client.commands.get('help').execute(message, [this.name]);
						}
						
						
						
						// !TELIALIGAEN KAMPER
						
						// if (
						//     args.length == 2 
						//     && args[0].toUpperCase() == 'KAMPER'
						//     && args[1].toUpperCase() == 'TEAM'
						//     ) {
						
						//     const msg = [];
						//     const tables = [];
						//     const table_data = [
						//         [
						//             // 'Divisjon', 
						//             '#', 
						//             'Lag', 
						//             'Spilt', 
						//             'Vunnet', 
						//             'Uavgjort', 
						//             'Tapt',
						//             '+/-',
						//             'Straff',
						//             'Bonus',
						//             'Poeng', 
						//         ],
						//     ];
						//     let division_name = "";
						//     let gp_name = "";
						
						//     const matches = [];
						
						//     for (const division of telialigaenconfig.divisions) {
						//         axios.get(`https://www.telialigaen.no/api/matches?division=${division['id']}&game=csgo&limit=100&offset=0&order=roundNumber&season=${telialigaenconfig.season}&status=unfinished`)
						//         .then( function(response) {
						//             for (const match of response.data) {
						//                 if (
						//                     match['homeTeam']['commonName'] == 'Gamer-Pilsen'
						//                     ||match['awayTeam']['commonName'] == 'Gamer-Pilsen'
						//                 ) {
						//                     matches.push([
						//                         match['tournament']['name'],
						//                         match['roundIdentifierText'],
						//                         match['startTime'],
						//                         match['postponed'],
						//                         match['cancelled'],
						//                         `${match['homeTeam']['name']}`,
						//                         match[''],
						//                         match[''],
						//                         match[''],
						//                         match[''],
						//                         match[''],
						//                     ]);
						//                 }
						//             }
						//         })
						//         .catch( function(error) {
						//             console.log(error);
						//         });
						//     }
					}  // execute
				}