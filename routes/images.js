const { CLARIFAI_API_KEY } = require('../config');
const Clarifai = require('clarifai');
const express = require('express');
const router = new express.Router();

const clarifai = new Clarifai.App({ apiKey: CLARIFAI_API_KEY });
const cors = require('cors');

const GENERAL_MODEL = 'aa7f35c01e0642fda5cf400f543e7c40';
const COLOR_MODEL = 'eeed0b6733a644cea07cf4c60f87ebb7';

// GENERAL_MODEL: 'aaa03c23b3724a16a56b629203edc62c',
//FOOD_MODEL: 'bd367be194cf45149e75f01d59f77ba7',
// TRAVEL_MODEL: 'eee28c313d69466f836ab83287a54ed9',
// NSFW_MODEL: 'e9576d86d2004ed1a38ba0cf39ecb4b1',
// WEDDINGS_MODEL: 'c386b7a870114f4a87477c0824499348',
// WEDDING_MODEL: 'c386b7a870114f4a87477c0824499348',
// COLOR_MODEL: 'eeed0b6733a644cea07cf4c60f87ebb7',
// CLUSTER_MODEL: 'cccbe437d6e54e2bb911c6aa292fb072',
// FACE_DETECT_MODEL: 'a403429f2ddf4b49b307e318f00e528b',
// FOCUS_MODEL: 'c2cf7cecd8a6427da375b9f35fcd2381',
// LOGO_MODEL: 'c443119bf2ed4da98487520d01a0b1e3',
// DEMOGRAPHICS_MODEL: 'c0c0ac362b03416da06ab3fa36fb58e3',
// GENERAL_EMBED_MODEL: 'bbb5f41425b8468d9b7a554ff10f8581',
// FACE_EMBED_MODEL: 'd02b4508df58432fbb84e800597b8959',
// APPAREL_MODEL: 'e0be3b9d6a454f0493ac3a30784001ff',
// MODERATION_MODEL: 'd16f390eb32cad478c7ae150069bd2c6',
// TEXTURES_AND_PATTERNS: 'fbefb47f9fdb410e8ce14f24f54b47ff',
// LANDSCAPE_QUALITY: 'bec14810deb94c40a05f1f0eb3c91403',
// PORTRAIT_QUALITY: 'de9bd05cfdbf4534af151beb2a5d0953'

// allow CORS on all routes in this router page
router.use(cors());

/** default get on route /images */
router.get('/', async (req, res, next) => {
  // console.log(req.body);
  // const { encodedpic } = req.body;

  try {
    const models = await clarifai.models.list();

    // return clarifai relation data back to user
    return res.json({ models });
  } catch (error) {
    return res.next(error);
  }
});

/** default get on route /images */
router.post('/', async (req, res, next) => {
  const { encodedpic } = req.body;

  try {
    const result = await clarifai.models.predict(
      {
        id: Clarifai.GENERAL_MODEL,
        version: GENERAL_MODEL
      },
      encodedpic
    );

    // clean up data from clarifai into nice output
    const relations = result.outputs[0].data.concepts.map(concept => {
      const { name, value } = concept;
      return { association: name, confidence: value };
    });

    // return clarifai relation data back to user
    return res.json({ relations });
  } catch (error) {
    return res.next(error);
  }
});

// exports router for app.js use
module.exports = router;
