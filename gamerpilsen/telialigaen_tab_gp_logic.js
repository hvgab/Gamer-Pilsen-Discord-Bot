
// Imports
const axios = require('axios');
const JSAsciiTable = require('./libs/js-ascii-table.js');

// Constants
const SEASONS_URL = 'https://www.telialigaen.no/api/seasons';
const TABLES_URL = 'https://www.telialigaen.no/api/tables'; //params: division=x&season=8595

const headers = [
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
];

function getTabellerGP(){
    
    const tableData = [headers];

    // Get seasons
    const seasons = axios.get(SEASONS_URL)
    .then( function(response) {
        
        for (const season of seasons.data){
            
            // filter
            if (!(season['active'] === true && season['product']['id'] == 165431)) continue;
            
            for (const divisionInfo of season['divisions']) {
                
                // Get Tables axios
                const tables = axios.get(TABLES_URL, {params:{division: divisionInfo['id'], season: season['id']}})
                .then( function(response){

                    // For each table get signups
                    for (const table of tables) {
                        for (const signup of table['signups']){

                            if (signup['participant']['shortname'] == '❡p') {
                                signupData = [signup['participant']['name']]
                                tableData.push(signupData);
                            }
                        }
                    }
                });
            }
        }
    })
}

function makeTable(tableData){
    console.log('Make table');
    console.log(`tableData: \n ${tableData}`);
    var tableOptions = {
        title: 'Telialigaen',
        spreadsheet: false,
        header: true,
        align: true,
        padding: 1,
        theme: JSAsciiTable.JSAsciiTable.getThemes()[1].value
        // theme: AsciiTable.getThemes()[0].value // // 0='MySQL' / 1='Unicode' / 2='Oracle'
    };
    console.log(`table_options: \n ${tableOptions}`);
    var table = new JSAsciiTable.JSAsciiTable(tableData, tableOptions);
    var ascii = table.render();
    console.log(ascii);
}


function main(){
    // Get data
    const tableData = getTabellerGP();
    console.log(`tableData. \n${tableData}`);
    // Make table
    const asciiTable = makeTable(tableData);
    console.log(`asciiTable:\n ${asciiTable}`);
    // Return to user
    // ...
}

main();