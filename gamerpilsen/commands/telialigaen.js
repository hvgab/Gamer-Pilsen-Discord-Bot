
const axios = require('axios');
const JSAsciiTable = require('../js-ascii-table.js');
const { description } = require('./args-info.js');

module.exports = {
    name: 'telialigaen',
    aliases: ['telia', 'ligaen', 'tl'],
    args:true,
    arguments: ['tabeller', 'terminliste', 'resultater', 'lagene'],
    execute(message, args) {

        
        if (args.length == 1 && args[0] == 'tabeller') {
            
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
                    const divisions = response.data;
                    // console.log(divisions);
                    for (const division of divisions) {
                        console.log(division['name']);
                        for (const signup of division['signups']) {
                            console.log(signup['participant']['shortname'])
                            if (signup['participant']['shortname'] == '❡p') {
                                signupData = [
                                    division['name'],
                                    signup['placement'],
                                    signup['participant']['name'],
                                    signup['played'],
                                    signup['wins'],
                                    signup['draws'],
                                    signup['losses'],
                                    `${signup['scoreFor']}/${signup['scoreAgainst']}`,
                                    signup['penalty'],
                                    signup['bonus'],
                                    signup['points'],
                                    // signup['status'],
                                ];
                                table_data.push(signupData);
                            }
                        }
                    } // Done looping

                    // Make table
                    var table = new JSAsciiTable.JSAsciiTable(table_data);
                    var ascii = table.render();
                    console.log(ascii);
                    tables.push(ascii);

                    return message.channel.send(`TeliaLigaen Tabeller\n\`\`\`${description}\`\`\``, {split:true});
                })
                .catch( function (error){
                    console.error(error);
                    return message.channel.send(`Error: ${error}`);
                });
        }
    }
}