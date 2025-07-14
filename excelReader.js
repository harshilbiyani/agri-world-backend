const xlsx = require('xlsx');
const workbook = xlsx.readFile('data.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: '' });

let lastDistrict = '';
let lastBlock = '';

const locations = jsonData.map(row => {
  if (row.District) lastDistrict = row.District;
  if (row.Block) lastBlock = row.Block;

  return {
    district: lastDistrict || 'undefined',
    block: lastBlock || 'undefined',
    village: row.Village || 'undefined'
  };
});

module.exports = locations;
