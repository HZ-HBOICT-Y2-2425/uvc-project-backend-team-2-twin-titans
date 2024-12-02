import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = {
  meta: {"title": "List of categories","date": "9 September 2001"},
  categories: {} }
const db = await JSONFilePreset('db.json', defaultData);
const _categories = db.data.categories;

export async function getCategories(req, res) {
  res.status(200).send(_categories); // Return the categories
}

export async function getConsumables(req, res) {
  // Map product IDs to URLs
  let _consumables = _categories.consumables;

  res.status(200).send(_consumables); // Return the list of category URLs
}

export async function getAllergies(req, res) {
  // Map product IDs to URLs
  let _allergies = _categories.allergies;

  res.status(200).send(_allergies); // Return the list of category URLs
}

export async function getConsumableByID(req, res) {
  let _consumableID = req.params.consumableid; // Get the consumableid from the URL parameter

  let _consumable = _categories.consumables.find(consumable => consumable.id == _consumableID); // Find the product with the matching ID

  if (!_consumable) {
    return res.status(404).send({ error: "Consumable not found." });
  } else {
    return res.status(200).send(_consumable); // Return the consumable object
  }
}

export async function getAllergyByID(req, res) {
  let _allergyID = req.params.allergyid; // Get the allergyid from the URL parameter

  let _allergy = _categories.allergies.find(allergy => allergy.id == _allergyID); // Find the product with the matching ID

  if (!_allergy) {
    return res.status(404).send({ error: "Allergy not found." });
  } else {
    return res.status(200).send(_allergy); // Return the consumable object
  }
}