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