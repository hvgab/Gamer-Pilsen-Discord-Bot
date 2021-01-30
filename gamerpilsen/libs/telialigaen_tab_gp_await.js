
// Imports
const axios = require('axios');
const JSAsciiTable = require('./js-ascii-table.js');

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

async function getSeasons(){
    const seasons = await axios.get(SEASONS_URL);
    console.log(`Got seasons (${seasons.data.length})`);
    return seasons.data;
}

async function getTables(divisionId, seasonId){
    const tables = await axios.get(TABLES_URL, {params:{division:divisionId, season:seasonId}});
    console.log(`Got tables (${tables.data.length})`);
    return tables.data;
}


async function getTabellerGP(){
    
    const tableData = [headers];

    // Get seasons
    const seasons = await getSeasons();
        
    for (const season of seasons){
            
        // filter
        if (!(season['active'] === true && season['product']['id'] == 165431)) continue;
            
        for (const division of season['divisions']) {
                
            // Get Tables axios
            const tables = await getTables(division['id'], season['id']);
            
            // For each table get signups
            for (const table of tables) {
                for (const signup of table['signups']){

                    if (signup['participant']['shortname'] == '❡p') {
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
                        ]
                        tableData.push(signupData);
                    }
                }
            }
        }
    }

    console.log(`tableData is now:`);
    console.log(tableData);
    return tableData;
}

function makeTable(tableData){
    console.log('Make table');
    // console.log(`tableData: \n ${tableData}`);
    var tableOptions = {
        title: 'Telialigaen',
        spreadsheet: false,
        header: true,
        align: true,
        padding: 1,
        theme: JSAsciiTable.JSAsciiTable.getThemes()[1].value
        // theme: AsciiTable.getThemes()[0].value // // 0='MySQL' / 1='Unicode' / 2='Oracle'
    };
    var table = new JSAsciiTable.JSAsciiTable(tableData, tableOptions);
    var ascii = table.render();
    console.log('Table made');
    return ascii;
}


async function main(){
    // Get data
    const tableData = await getTabellerGP();
    console.log(`tableData. \n${tableData}`);
    // Make table
    const asciiTable = await makeTable(tableData);
    console.log(`asciiTable:\n ${asciiTable}`);
    // Return to user
    return asciiTable;
}

// main();

exports.main = main;