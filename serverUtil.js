import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "data.json");

let cache = null; //avoids redundant server calls

export const getData = () => {
  if (!cache) {
    cache = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  }
  return cache;
};

export const saveData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  cache = data;
};

export const getCurrentPrice = (product) => {
  const { originalPrice, discount } = product;
  if (discount > 0) {
    return originalPrice - originalPrice * (discount / 100);
  }
  return originalPrice;
};
