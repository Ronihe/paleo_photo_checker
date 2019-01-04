const { CLARIFAI_API_KEY } = require('../config');
const Clarifai = require('clarifai');
const express = require('express');
const router = new express.Router();
const checkPaleo = require('../helpers/checkPaleo');
const APIError = require('../helpers/APIError');

const clarifai = new Clarifai.App({ apiKey: CLARIFAI_API_KEY });
const cors = require('cors');
const FOOD_MODEL = 'bd367be194cf45149e75f01d59f77ba7';

// allow CORS on all routes in this router page
router.use(cors());

router.get('/test', (req, res, next) => {
  res.render('homepage');
});

/** default get on route /paleo*/
router.post('/', async (req, res, next) => {
  const { encodedpic } = req.body;
  //console.log(req.body);

  try {
    const result = await clarifai.models.predict(FOOD_MODEL, encodedpic);
    //console.log(result);
    // clean up data from clarifai into nice output
    const relations = result.outputs[0].data.concepts.filter(
      concept => concept.value > 0.9
    );
    console.log(relations.map(obj => obj.name));
    // const paleoList = [];
    // for (let ingr of relations.map(obj => obj.name)) {
    //   const isPaleo = await checkPaleo(ingr);
    //   if (isPaleo) {
    //     paleoList.push(isPaleo);
    //   }
    // }

    const paleoListRes = await Promise.all(
      relations.map(obj => checkPaleo(obj.name))
    );
    const paleoList = paleoListRes.filter(o => o);

    if (paleoList.length === 0) {
      throw new APIError(400, 'invalid pic, can you take another one?');
    }
    return res.json({ paleoList });
  } catch (error) {
    return next(error);
  }
});

// exports router for app.js use
module.exports = router;
