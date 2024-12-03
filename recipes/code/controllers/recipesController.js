import { JSONFilePreset } from "lowdb/node";

// Lees of maak db.json
const defaultData = { 
  meta: { "title": "List of recipes", "date": "September 2011" },
  recipes: [],
  ingredients: [],
  categories: {
    consumables: [],
    allergies: []
  }
};
const db = await JSONFilePreset('db.json', defaultData);

// Laad data in het geheugen om te voorkomen dat het bestand bij elke aanvraag opnieuw wordt gelezen
await db.read();

// Cache recepten, ingrediënten, categorieën en allergieën voor snellere toegang
const recipes = db.data.recipes;

const ingredientsMap = db.data.ingredients.reduce((map, ingredient) => {
  map[ingredient.id] = ingredient;
  return map;
}, {});

const consumablesMap = db.data.categories.consumables.reduce((map, category) => {
  map[category.id] = category;
  return map;
}, {});

const allergiesMap = db.data.categories.allergies.reduce((map, allergy) => {
  map[allergy.id] = allergy;
  return map;
}, {});

// Functie om recepten op te halen met filtering
export async function getAllRecipes(req, res) {
  const { categories = [], allergies = [] } = req.query;

  const categoryFilter = categories.length > 0 ? categories.split(',').map(Number) : [];
  const allergyFilter = allergies.length > 0 ? allergies.split(',').map(Number) : [];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = categoryFilter.length === 0 || recipe.category.some(cat => categoryFilter.includes(cat));
    const matchesAllergy = allergyFilter.length === 0 || recipe.allergyID.some(allergy => allergyFilter.includes(allergy));
    return matchesCategory && matchesAllergy;
  });

  const enrichedRecipes = filteredRecipes.map(recipe => ({
    ...recipe,
    category: recipe.category.map(catId => consumablesMap[catId]).filter(c => c !== undefined), // Volledige categorieën
    allergyID: recipe.allergyID.map(allergyId => allergiesMap[allergyId]).filter(a => a !== undefined) // Volledige allergieën
  }));

  res.status(200).json(enrichedRecipes);
}

// Functie om een recept op te halen op basis van id
export async function getRecipeById(req, res) {
  const recipeId = parseInt(req.params.id);
  const recipe = recipes.find(r => r.id === recipeId);

  if (!recipe) {
    return res.status(404).send({ message: "Recept niet gevonden." });
  }

  // Map ingredient IDs naar ingredient objecten
  const ingredients = recipe.ingredients.map(ingredientId => ingredientsMap[ingredientId]);

  // Filter eventuele niet-geldige ingrediënten (indien sommige ingredienten IDs niet bestaan)
  const validIngredients = ingredients.filter(i => i !== undefined);

  // Voeg categorie- en allergiegegevens toe
  const consumableCategories = recipe.category.map(catId => consumablesMap[catId]).filter(c => c !== undefined);
  const allergies = recipe.allergyID.map(allergyId => allergiesMap[allergyId]).filter(a => a !== undefined);

  res.status(200).json({ 
    ...recipe, 
    ingredients: validIngredients,
    consumableCategories,
    allergies
  });
}
