import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = {
  meta: {"title": "List of categories","date": "9 September 2001"},
  categories: {
    consumables: [],
    allergies: []
  } }
const db = await JSONFilePreset('db.json', defaultData);
const _categories = db.data.categories;

export async function getCategories(req, res) {
  const _consumableUrls = _categories.consumables.map(consumable => `categories/consumables/${consumable.id}`);
  const _allergyUrls = _categories.allergies.map(allergy => `categories/allergies/${allergy.id}`);
  
  // Concatenate the two arrays
  const categoryUrls = [..._consumableUrls, ..._allergyUrls];
  
  // Send the result as a JSON response
  res.status(200).send(categoryUrls);
}

export async function getConsumables(req, res) {
  // Get the list of consumables
  const _consumables = _categories.consumables;

  res.status(200).send(_consumables); // Return the list of consumables
}

export async function getAllergies(req, res) {
  // Get the list of allergies
  const _allergies = _categories.allergies;

  res.status(200).send(_allergies); // Return the list of allergies
}

export async function getConsumableByID(req, res) {
  const _consumableID = req.params.consumableid; // Get the consumableid from the URL parameter

  const _consumable = _categories.consumables.find(consumable => consumable.id == _consumableID); // Find the consumable with the matching ID

  if (!_consumable) {
    return res.status(404).send({ error: "Consumable not found." });
  } else {
    return res.status(200).send(_consumable); // Return the consumable object
  }
}

export async function getAllergyByID(req, res) {
  const _allergyID = req.params.allergyid; // Get the allergyid from the URL parameter

  const _allergy = _categories.allergies.find(allergy => allergy.id == _allergyID); // Find the allergy with the matching ID

  if (!_allergy) {
    return res.status(404).send({ error: "Allergy not found." });
  } else {
    return res.status(200).send(_allergy); // Return the allergy object
  }
}