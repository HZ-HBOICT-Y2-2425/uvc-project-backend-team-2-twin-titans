import { JSONFilePreset } from "lowdb/node";

// Lees of maak db.json
const defaultData = { meta: { "title": "List of recipes", "date": "September 2011" } }
const db = await JSONFilePreset('db.json', defaultData);

// Laad data in het geheugen om te voorkomen dat het bestand bij elke aanvraag opnieuw wordt gelezen
await db.read();

// Cache recepten, ingrediënten, categorieën, allergieën en seizoenen voor snellere toegang
const recipes = db.data.recipes;
const ingredientsMap = db.data.ingredients.reduce((map, ingredient) => {
  map[ingredient.id] = ingredient;
  return map;
}, {});

// Maak de consumablesMap, allergiesMap en seasonsMap zoals je dat voor ingredients hebt gedaan
const consumablesMap = db.data.categories.consumables.reduce((map, category) => {
  map[category.id] = category;
  return map;
}, {});

const allergiesMap = db.data.categories.allergies.reduce((map, allergy) => {
  map[allergy.id] = allergy;
  return map;
}, {});

const seasonsMap = db.data.categories.seasons.reduce((map, season) => {
  map[season.id] = season;
  return map;
}, {});

// Functie om recepten op te halen met filtering
export async function getAllRecipes(req, res) {
  const { categories = [], allergies = [], seasons = [] } = req.query;

  // Converteer de query parameters naar arrays van getallen
  const categoryFilter = categories.length > 0 ? categories.split(',').map(Number) : [];
  const allergyFilter = allergies.length > 0 ? allergies.split(',').map(Number) : [];
  const seasonFilter = seasons.length > 0 ? seasons.split(',').map(Number) : [];

  // Filter recepten op basis van de opgegeven categorieën, allergieën en seizoenen
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = categoryFilter.length === 0 || recipe.category.some(cat => categoryFilter.includes(cat));
    const matchesAllergy = allergyFilter.length === 0 || recipe.allergyID.some(allergy => allergyFilter.includes(allergy));

    // Controleer of 'seasonID' overeenkomt met de geselecteerde seizoenen
    const matchesSeason = seasonFilter.length === 0 || recipe.seasonID.some(season => seasonFilter.includes(season));

    // Recept moet voldoen aan alle filters (categorie, allergie, seizoen)
    return matchesCategory && matchesAllergy && matchesSeason;
  });

  // Verrijk de recepten met de volledige categorieën, allergieën en seizoenen
  const enrichedRecipes = filteredRecipes.map(recipe => ({
    ...recipe,
    category: recipe.category.map(catId => consumablesMap[catId]).filter(c => c !== undefined),
    allergyID: recipe.allergyID.map(allergyId => allergiesMap[allergyId]).filter(a => a !== undefined),
    season: recipe.seasonID.map(seasonId => seasonsMap[seasonId]).filter(s => s !== undefined) // Verrijk de recepten met seizoenen
  }));

  // Geef de gefilterde recepten terug als JSON
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

  res.status(200).json({ ...recipe, ingredients: validIngredients });
}
