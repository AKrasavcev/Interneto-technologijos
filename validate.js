import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";

// Load combined schema and JSON data
const restaurantSchema = JSON.parse(
  fs.readFileSync("./restaurant-combined.schema.json", "utf-8")
);
const restaurantData = JSON.parse(fs.readFileSync("./restaurant.json", "utf-8"));

// Initialize AJV
const ajv = new Ajv({ strict: false }); // strict: false allows some leniency
addFormats(ajv);

// Compile the schema
const validate = ajv.compile(restaurantSchema);

// Validate the JSON
const valid = validate(restaurantData);

if (valid) {
  console.log("✅ JSON is valid!");
} else {
  console.error("❌ Validation errors:");
  console.error(validate.errors);
}
