const xlsx = require("xlsx");
const cropData = {};

function loadCropExcel() {
  const workbook = xlsx.readFile("final_crop_data.xlsx");
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  const headers = json[0].map((h) => h.toUpperCase().trim());
  const rows = json.slice(2);

  for (let row of rows) {
    const record = {};
    row.forEach((val, i) => (record[headers[i]] = val));
    const key = `${record["DISTRICT NAME"]}_${record["BLOCK NAME"]}_${record["VILLAGE NAME"]}`;
    cropData[key] = record;
  }
}

function getVillageOptions() {
  return Object.keys(cropData).map((k) => {
    const [district, block, village] = k.split("_");
    return { district, block, village };
  });
}

function matchCropData(district, block, village, input) {
  const key = `${district}_${block}_${village}`;
  const data = cropData[key];
  if (!data) return null;

  const deficiencies = {};
  const match = ["NITROGEN", "PHOSPHORUS", "POTASSIUM", "OC", "EC", "PH"].every(attr => {
    if (!input[attr]) return true;
    if (data[attr]?.toLowerCase() === input[attr]?.toLowerCase()) return true;
    deficiencies[attr] = { expected: data[attr], provided: input[attr] };
    return false;
  });

  return match ? { match: true, crops: getRecommendedCrops(data) } : { match: false, deficiencies };
}

function getRecommendedCrops(data) {
  const crops = {};
  Object.entries(data).forEach(([key, val]) => {
    if (val === "YES") crops[key] = true;
  });
  return crops;
}

module.exports = { loadCropExcel, getVillageOptions, matchCropData };