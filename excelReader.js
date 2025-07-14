const XLSX = require("xlsx");
const fs = require("fs");

function readLocationsFromExcel() {
  const workbook = XLSX.readFile("locations.xlsx"); // replace with correct filename
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  // Clean and format
  return data.map((row) => ({
    district: row.District || "",
    block: row.Block || "",
    village: row.Village || ""
  }));
}

module.exports = readLocationsFromExcel;

