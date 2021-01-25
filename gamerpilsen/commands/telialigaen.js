
const axios = require('axios');
const JSAsciiTable = require('../libs/js-ascii-table.js');

module.exports = {
    name: 'telialigaen',
    description: 'Informasjon om GP i Telialigaen',
    aliases: ['telia', 'ligaen', 'tl'],
    args:true,
    arguments: ['tabeller', 'terminliste', 'resultater', 'lagene'],
    usage: ['<args> [lag (nytappa/iskald)]'],
    execute(message, args) {

        if (args[0] == 'tabeller'){
            
        }

        if (args.length == 2 && args[0] == 'tabeller' && args[1] == 'gp') {
            
            console.debug('Arg = Tabeller');

            const tables_url = 'https://www.telialigaen.no/api/tables?division&season=8595';
            const msg = [];
            const tables = [];
            const table_data = [
                [
                    'Divisjon', 
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

            axios.get(tables_url)
                .then( function(response) {
                    console.debug('Got axios data for tables.')
                    const divisions = response.data;
                    // console.log(divisions);
                    for (const division of divisions) {
                        console.log(`Looping division: ${division['name']}`);
                        for (const signup of division['signups']) {
                            console.log(`Looping signups: ${signup['participant']['name']}`);
                            if (signup['participant']['shortname'] == '❡p') {
                                console.debug(`This signup is GP ${signup['participant']}`);
                                signupData = [
                                    division['name'],
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
                                console.debug('Pushed signupdata to table_data');
                            }
                        }
                    } // Done looping
                    console.log('Done looping');

                    // Make table
                    console.log('Making ascii table');
                    console.log(`table_data: \n ${table_data}`);
                    var table_options = {
                        title: 'Telialigaen',
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
                })
                .catch( function (error){
                    console.error(error);
                    return message.channel.send(`Error: ${error}`);
                });
        }

        // !telialigaen tabeller bitter
        if (args.length == 2 && args[0] == 'tabeller') {
            
            console.debug('Arg = Tabeller');

            const tables_url = 'https://www.telialigaen.no/api/tables?division&season=8595';
            const msg = [];
            const tables = [];
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

            axios.get(tables_url)
                .then( function(response) {
                    console.debug('Got axios data for tables.')
                    const divisions = response.data;
                    // console.log(divisions);
                    for (const division of divisions) {
                        console.log(`Looping division: ${division['name']}`);
                        for (const signup of division['signups']) {
                            console.log(`Looping signups: ${signup['participant']['name']}`);
                            if (signup['participant']['name'].toLowerCase() == `Gamer-Pilsen ${args[1]}`.toLowerCase()) {

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
                            }
                        }
                    } // Done looping
                    console.log('Done looping');

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
                })
                .catch( function (error){
                    console.error(error);
                    return message.channel.send(`Error: ${error}`);
                });
        }
    }
}