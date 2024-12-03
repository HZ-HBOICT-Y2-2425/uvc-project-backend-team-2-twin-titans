import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = {
  meta: {"title": "List of products","date": "9 September 2001"},
  lastID: 0,
  products : [] }
const db = await JSONFilePreset('db.json', defaultData)
const _products = db.data.products

export async function getProducts(req, res) {
  // Map product IDs to URLs
  let _productUrls = _products.map(product => `products/${product.id}`);

  res.status(200).send(_productUrls); // Return the list of product URLs
}

export async function getProduct(req, res) {
  let _productID = req.params.productid; // Get the productid from the URL parameter

  let _product = _products.find(product => product.id == _productID); // Find the product with the matching ID

  if (!_product) {
    return res.status(404).send({ error: "Product not found." });
  } else {
    return res.status(200).send(_product); // Return the product object
  }
}

export async function getProductsByUserID(req, res) {
  let _userID = req.params.userid; // Get the userid from the query parameter

  let _userProducts = _products.filter(product => product.userID == _userID); // Find the products with the matching userID

  if (!_userProducts) {
    return res.status(404).send({ error: "No products found for this user." });
  } else {
    return res.status(200).send(_userProducts); // Return the product
  }
}

export async function createProduct(req, res) {
  let _lastID = db.data.products.length ? db.data.products[db.data.products.length - 1].id : 0;

  // Auto-increment ID
  let _id = _lastID + 1;

  let _userID = parseInt(req.query.userID);
  let _title = req.query.title;
  let _consumables = req.query.consumables;
  let _allergies = req.query.allergies;
  let _price = parseFloat(req.query.price);
  let _amount = parseFloat(req.query.amount);
  let _unit = req.query.unit;
  let _description = req.query.description;

  // Validate input fields
  if (!_userID || !_title || !_consumables || isNaN(_price) || isNaN(_amount) || !_unit || !_description) {
    return res.status(400).send({ error: "All required fields must be filled in correctly." });
  }

  // Validate and process consumables
  if (typeof _consumables === 'string') {
    _consumables = _consumables
      .split(',')
      .map(Number)
      .filter(num => !isNaN(num)); // Remove invalid entries (NaN)
  } else if (typeof _consumables === 'number') {
    _consumables = [_consumables];
  } else {
    return res.status(400).send({ error: "Consumables must be a valid ID number or a comma-separated list of numbers." });
  }

  // Check if consumables array is valid after processing
  if (!_consumables.length) {
    return res.status(400).send({ error: "Consumables must contain at least one valid ID number." });
  }

  // Validate and process allergies
  if (!_allergies) {
    _allergies = [];
  } else if (typeof _allergies === 'string') {
    _allergies = _allergies
      .split(',')
      .map(Number)
      .filter(num => !isNaN(num)); // Remove invalid entries (NaN)
  } else if (typeof _allergies === 'number') {
    _allergies = [_allergies];
  } else {
    return res.status(400).send({ error: "Allergies must be a valid ID number or a comma-separated list of numbers." });
  }

  // Check if allergies array contains invalid entries
  if (_allergies.some(isNaN)) {
    return res.status(400).send({ error: "All allergies must be valid ID numbers." });
  }

  // Initialize CO₂ savings
  let _co2Contribution = 0;

  if (_unit !== "g" && _unit !== "ml" && _unit !== "kg" && _unit !== "l") {
    return res.status(400).send({ error: "Unit must be 'g', 'ml', 'kg' or 'l'." });
  } else {
    // Calculate general CO₂ savings
    if (_unit === "g" || _unit === "ml") {
      _co2Contribution = ((_amount / 1000) / 7.1) * 0.264;
    } else {
      _co2Contribution = (_amount / 7.1) * 0.264;
    }
  }

  let _reserved = false;
  let _reservedByUserID = null;

  // Calculate '_expirationDate' (7 days ahead of _creationDate)
  let _creationDate = new Date().toLocaleString();
  let _creationDateObject = new Date(); // Parse to Date object
  let _expirationDateObject = new Date(_creationDateObject); // Copy the date
  _expirationDateObject.setDate(_expirationDateObject.getDate() + 7); // Add 7 days
  let _expirationDate = _expirationDateObject.toLocaleString(); // Format to string

  // Create the new product
  let _product = {
    id: _id,
    userID: _userID,
    title: _title,
    consumables: _consumables,
    allergies: _allergies,
    price: parseFloat(_price.toFixed(2)),
    amount: _amount,
    unit: _unit,
    co2Contribution: parseFloat(_co2Contribution.toFixed(3)),
    description: _description,
    reserved: _reserved,
    reservedByUserID: _reservedByUserID,
    creationDate: _creationDate,
    expirationDate: _expirationDate
  };

  _products.push(_product); // Add the new product to the products array

  // Update the JSON file
  db.data.lastID = _id; // Update the last used ID
  await db.write(); // Save changes to the file

  res.status(200).send(`Added product: ${JSON.stringify(_product.id)}`);
}

export async function reserveProduct(req, res) {
  const { productid, userid, reservedbyuserid } = req.params; // Get the userid and productid from the URL parameters

  let _product = _products.find(product => product.id == productid); // Find the product with the matching ID

  if (!_product) {
    return res.status(404).send({ error: "Product not found." });
  } else if (_product.userID == userid) {
    if (_product.reserved) {
      return res.status(400).send({ error: "Product already reserved." });
    } else {
      _product.reservedByUserID = parseInt(reservedbyuserid); // Set the user who reserved the product

      if (_product.reservedByUserID === null || isNaN(_product.reservedByUserID)) {
        return res.status(400).send({ error: "Invalid user ID." });
      } else if (_product.reservedByUserID === _product.userID) {
        return res.status(400).send({ error: "Cannot reserve your own product." });
      } else {
        _product.reserved = true; // Set the product to reserved

        // Update the JSON file
        await db.write(); // Save changes to the file

        res.status(200).send(`Reserved product: ${JSON.stringify(_product.id)} for user ${reservedbyuserid}`);
      }
    }
  } else if (_product.userID != userid) {
    return res.status(403).send({ error: "Unauthorized." });
  } else {
    return res.status(400).send({ error: "Invalid request." });
  }
}

export async function unreserveProduct(req, res) {
  const { productid, userid } = req.params; // Get the userid and productid from the URL parameters

  let _product = _products.find(product => product.id == productid); // Find the product with the matching ID

  if (!_product) {
    return res.status(404).send({ error: "Product not found." });
  } else if (_product.userID == userid) {
    if (!_product.reserved) {
      return res.status(400).send({ error: "Product is not reserved." });
    } else {
      _product.reserved = false; // Set the product to unreserved
      _product.reservedByUserID = null; // Remove the user who reserved the product

      // Update the JSON file
      await db.write(); // Save changes to the file

      res.status(200).send(`Unreserved product: ${JSON.stringify(_product.id)}`);
    }
  } else {
    return res.status(403).send({ error: "Unauthorized." });
  }
}

export async function updateProduct(req, res) {
  const { productid, userid } = req.params; // Get the userid and productid from the URL parameters

  let _product = _products.find(product => product.id == productid); // Find the product with the matching ID

  if (!_product) {
    return res.status(404).send({ error: "Product not found." });
  } else if (_product.userID == userid) {
    if (_product.reserved) {
      return res.status(400).send({ error: "Product is reserved." });
    } else {
      let _title = req.query.title;
      let _consumables = req.query.consumables;
      let _allergies = req.query.allergies;
      let _price = parseFloat(req.query.price);
      let _amount = parseFloat(req.query.amount);
      let _unit = req.query.unit;
      let _description = req.query.description;

      // Validate input fields
      if (!_title || !_consumables || isNaN(_price) || isNaN(_amount) || !_unit || !_description) {
        return res.status(400).send({ error: "All required fields must be filled in correctly." });
      }

      // Check if _consumables is a string and split it into an array
      if (typeof _consumables === 'string') {
        _consumables = _consumables.split(',').map(Number);

        if (_consumables === null) {
          return res.status(400).send({ error: "Consumables must be valid ID number." });
        }
      } else if (typeof _consumables === 'number') {
        _consumables = [_consumables];
      }

      // Check if _allergies is a string and split it into an array
      if (!_allergies) {
        _allergies = [];
      } else if (typeof _allergies === 'string') {
        _allergies = _allergies.split(',').map(Number);

        if (_allergies === null) {
          return res.status(400).send({ error: "Allergies must be valid ID number." });
        }
      } else if (typeof _allergies === 'number') {
        _allergies = [_allergies];
      }

      // Initialize CO₂ savings
      let _co2Contribution = 0;

      if (_unit !== "g" && _unit !== "ml" && _unit !== "kg" && _unit !== "l") {
        return res.status(400).send({ error: "Unit must be 'g', 'ml', 'kg' or 'l'."});
      } else {
        // Calculate general CO₂ savings
        if (_unit === "g" || _unit === "ml") {
          _co2Contribution = ((_amount / 1000) / 7.1) * 0.264;
        } else {
          _co2Contribution = (_amount / 7.1) * 0.264;
        }
      }

      // Calculate '_expirationDate' (7 days ahead of _creationDate)
      let _creationDate = new Date().toLocaleString();
      let creationDateObject = new Date(); // Parse to Date object
      let expirationDateObject = new Date(creationDateObject); // Copy the date
      expirationDateObject.setDate(expirationDateObject.getDate() + 7); // Add 7 days
      let _expirationDate = expirationDateObject.toLocaleString(); // Format to string

      _product.title = _title;
      _product.consumables = _consumables;
      _product.allergies = _allergies;
      _product.price = parseFloat(_price.toFixed(2));
      _product.amount = _amount;
      _product.unit = _unit;
      _product.co2Contribution = parseFloat(_co2Contribution.toFixed(3));
      _product.description = _description;
      _product.creationDate = _creationDate;
      _product.expirationDate = _expirationDate;

      // Update the JSON file
      await db.write(); // Save changes to the file

      res.status(200).send(`Edited product: ${JSON.stringify(_product.id)}`);
    }
  }

  if (userid == _product.userID) {
    if (!_product) {
      return res.status(404).send({ error: "Product not found." });
    } else {
      
    }
  } else {
    return res.status(403).send({ error: "Unauthorized." });
  }
}

export async function deleteProduct(req, res) {
  const { userid, productid } = req.params; // Get the userid and productid from the URL parameters

  let _productIndex = _products.findIndex(product => product.id == productid); // Find the product with the matching ID

  if (userid == _products[_productIndex].userID) {
    if (_productIndex === -1) {
      return res.status(404).send({ error: "Product not found." });
    } else {
      _products.splice(_productIndex, 1); // Remove the product from the products array

      // Update the JSON file
      await db.write(); // Save changes to the file

      res.status(200).send(`Deleted product: ${productid}`);
    }
  } else {
    return res.status(403).send({ error: "Unauthorized." });
  }
}