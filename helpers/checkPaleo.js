//get the api_id, api
const { FOOD_APP_ID, FOOD_API } = require('../config');
const axios = require('axios');

async function checkPaleo(Ingr) {
  try {
    // get the food ID
    const foodUrl = `https://api.edamam.com/api/food-database/parser?ingr=${Ingr}&app_id=${FOOD_APP_ID}&app_key=${FOOD_API}`;
    const foodRes = await axios.get(foodUrl);
    const measureURI = foodRes.data.hints[0].measures[0].uri;
    const foodURI = foodRes.data.hints[0].food.uri;
    console.log(foodURI);
    // get the nutrient
    const nutrientUrl = `https://api.edamam.com/api/food-database/nutrients?app_id=${FOOD_APP_ID}&app_key=${FOOD_API}`;
    const nutrientRes = await axios.post(nutrientUrl, {
      yield: 1,
      ingredients: [
        {
          quantity: 1,
          measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_cup',
          foodURI: foodURI
        }
      ]
    });
    const healthLabels = nutrientRes.data.healthLabels;
    const message = healthLabels.includes('PALEO')
      ? 'Is Paleo'
      : 'Is not Paleo';
    return { [Ingr]: message };
  } catch (error) {
    return { [Ingr]: "cannot find this ingr's paleo fact" };
  }
}

module.exports = checkPaleo;
