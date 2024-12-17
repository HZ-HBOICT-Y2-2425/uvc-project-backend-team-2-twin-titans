import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = {
  meta: {"title": "List of reviews","date": "9 September 2001"},
  lastID: 0,
  reviews: [] }
const db = await JSONFilePreset('db.json', defaultData);
const _reviews = db.data.reviews;

export async function getReviews(req, res) {
  // Map review IDs to URLs
  let _reviewUrls = _reviews.map(review => `reviews/review/${review.id}`);

  res.status(200).send(_reviewUrls); // Return the list of review URLs
}

export async function getReview(req, res) {
  let _reviewID = req.params.reviewid; // Get the productid from the URL parameter

  let _review = _reviews.find(review => review.id == _reviewID); // Find the product with the matching ID

  if (!_review) {
    return res.status(404).send({ error: "Review not found." });
  } else {
    return res.status(200).send(_review); // Return the review object
  }
}

export async function getReviewsByUserID(req, res) {
  let _userID = req.params.userid; // Get the userid from the URL parameter

  let _reviewsByUserID = _reviews.filter(review => review.userID == _userID); // Find the reviews with the matching userID

  if (!_reviewsByUserID) {
    return res.status(404).send({ error: "Reviews not found." });
  } else {
    return res.status(200).send(_reviewsByUserID); // Return the reviews
  }
}

export async function getReviewsByRecipeID(req, res) {
  let _recipeID = req.params.recipeid; // Get the recipeid from the URL parameter

  let _reviewsByRecipeID = _reviews.filter(review => review.recipeID == _recipeID); // Find the reviews with the matching recipeID

  if (!_reviewsByRecipeID) {
    return res.status(404).send({ error: "Reviews not found." });
  } else {
    return res.status(200).send(_reviewsByRecipeID); // Return the reviews
  }
}

export async function createReview(req, res) {
  let _lastID = db.data.reviews.length ? db.data.reviews[db.data.reviews.length - 1].id : 0;

  // Auto-increment ID
  let _id = _lastID + 1;

  let _userID = parseInt(req.query.userID);
  let _recipeID = parseInt(req.query.recipeID);
  let _costRating = parseInt(req.query.costRating);
  let _difficultyRating = parseInt(req.query.difficultyRating);
  let _tasteRating = parseInt(req.query.tasteRating);

  // Validate input fields
  if (isNaN(_userID) || isNaN(_recipeID) || isNaN(_costRating) || isNaN(_difficultyRating) || isNaN(_tasteRating)) {
    return res.status(400).send({ error: "All required fields must be filled in correctly." });
  } else if (_costRating < 1 || _costRating > 5 || _difficultyRating < 1 || _difficultyRating > 5 || _tasteRating < 1 || _tasteRating > 5) {
    return res.status(400).send({ error: "Ratings must be between 1 and 5." });
  }

  let _totalRating = parseFloat(((_costRating + _difficultyRating + _tasteRating) / 3).toFixed(1));

  let _creationDate = new Date().toLocaleString();

  let _review = {
    id: _id,
    userID: _userID,
    recipeID: _recipeID,
    totalRating: _totalRating,
    costRating: _costRating,
    difficultyRating: _difficultyRating,
    tasteRating: _tasteRating,
    creationDate: _creationDate
  };

  _reviews.push(_review); // Add the review to the database

  db.data.lastID = _id; // Update the lastID in the database
  await db.write(); // Write the changes to the database

  return res.status(200).send(`Created review: ${JSON.stringify(_review.id)}`);
}

export async function updateReview(req, res) {
  const { reviewid, userid } = req.params;

  let _review = _reviews.find(review => review.id == reviewid); // Find the review with the matching ID

  if (!_review) {
    return res.status(404).send({ error: "Review not found." });
  } else if (_review.userID == userid) {
    let _costRating = parseInt(req.query.costRating);
    let _difficultyRating = parseInt(req.query.difficultyRating);
    let _tasteRating = parseInt(req.query.tasteRating);

    // Validate input fields
    if (isNaN(_costRating) || isNaN(_difficultyRating) || isNaN(_tasteRating)) {
      return res.status(400).send({ error: "All required fields must be filled in correctly." });
    } else if (_costRating < 1 || _costRating > 5 || _difficultyRating < 1 || _difficultyRating > 5 || _tasteRating < 1 || _tasteRating > 5) {
      return res.status(400).send({ error: "Ratings must be between 1 and 5." });
    }

    let _totalRating = parseFloat(((_costRating + _difficultyRating + _tasteRating) / 3).toFixed(1));

    _review.totalRating = _totalRating;
    _review.costRating = _costRating;
    _review.difficultyRating = _difficultyRating;
    _review.tasteRating = _tasteRating;

    await db.write(); // Write the changes to the database

    return res.status(200).send(`Updated review: ${JSON.stringify(_review.id)}`);
  } else if (_review.userID != userid) {
    return res.status(403).send({ error: "Unauthorized." });
  } else {
    return res.status(400).send({ error: "Invalid request." });
  }
}

export async function deleteReview(req, res) {
  const { reviewid, userid } = req.params; // Get the userid and productid from the URL parameters

  let _reviewIndex = _reviews.findIndex(review => review.id == reviewid); // Find the product with the matching ID

  if (_reviewIndex === -1) {
    return res.status(404).send({ error: "Review not found." });
  }

  if (_reviews[_reviewIndex].userID == userid) {
    _reviews.splice(_reviewIndex, 1); // Remove the review from the reviews array

    // Update the JSON file
    await db.write(); // Save changes to the file

    res.status(200).send(`Deleted review: ${reviewid}`);
  } else if (_reviews[_reviewIndex].userID != userid) {
    return res.status(403).send({ error: "Unauthorized." });
  } else {
    return res.status(400).send({ error: "Invalid request." });
  }
}