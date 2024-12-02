import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: { "tile": "List of recipes", "date": "September 2011" } }
const db = await JSONFilePreset('db.json', defaultData);

// Load data into memory to avoid reading the file on each request
await db.read();

// Cache recipes and ingredients for faster access
const recipes = db.data.recipes;
const ingredientsMap = db.data.ingredients.reduce((map, ingredient) => {
  map[ingredient.id] = ingredient;
  return map;
}, {});

export async function getAllRecipes(req, res) {
  res.status(200).send(recipes);
}

export async function getRecipeById(req, res) {
  const recipeId = parseInt(req.params.id);
  const recipe = recipes.find(r => r.id === recipeId);

  if (!recipe) {
    return res.status(404).send({ message: "Recept niet gevonden." });
  }

  // Map ingredient IDs to ingredient objects
  const ingredients = recipe.ingredients.map(ingredientId => ingredientsMap[ingredientId]);

  // Filter out undefined ingredients (in case some ingredient IDs don't exist in the ingredients array)
  const validIngredients = ingredients.filter(i => i !== undefined);

  res.status(200).json({ ...recipe, ingredients: validIngredients });
}

export async function test(req, res) {
  console.log(req.body);
  res.status(200).send("test reached");
}