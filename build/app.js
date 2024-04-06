"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const openai_1 = __importDefault(require("openai"));
require('dotenv').config();
// Create Express server
const app = (0, express_1.default)();
const port = 3000;
const openai = new openai_1.default({
    apiKey: process.env['OPENAI_API_KEY']
});
// Printify constants
const PRINTIFY_SHOP_ID = "15300573";
// Express configuration
app.use((0, cors_1.default)()); // Enable CORS
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// Start server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
// Test endpoint
app.get('/', (req, res) => {
    res.send('Hello world');
});
// Generate an image for a given prompt using DALLE
app.post('/generateImage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield openai.images.generate({
        model: "dall-e-3",
        prompt: req.body.prompt,
        n: 1,
        size: "1792x1024",
    });
    const image_url = response.data;
    res.send(image_url);
}));
// Upload image to Printify
app.post('/uploadImage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('https://api.printify.com/v1/uploads/images.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        },
        body: JSON.stringify({
            "file_name": "image.png",
            "url": req.body.url
        })
    });
    // Print the body of the response
    res.send(yield response.json());
}));
// Create a mug product on Printify based on an uploaded image
app.post('/createMug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mugRequest = yield (fetch('https://api.printify.com/v1/shops/' + PRINTIFY_SHOP_ID + '/products.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        },
        body: JSON.stringify({
            "title": "Product",
            "description": "Good product",
            "blueprint_id": 478,
            "print_provider_id": 28,
            "variants": [
                {
                    "id": 65216,
                    "price": 400,
                    "is_enabled": true
                }
            ],
            "print_areas": [
                {
                    "variant_ids": [65216],
                    "placeholders": [
                        {
                            "position": "front",
                            "images": [
                                {
                                    "id": req.body.image.id,
                                    "name": "imgpng.png",
                                    "type": "image/png",
                                    "height": req.body.image.height,
                                    "width": req.body.image.width,
                                    "x": 0.5,
                                    "y": 0.5,
                                    "scale": 1,
                                    "angle": 0
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }));
    // Get mug preview images
    const mugPreview = yield mugRequest.json();
    return mugPreview;
}));
// Create a puzzle product on Printify based on an uploaded image
app.post('/createPuzzle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const puzzleRequest = yield (fetch('https://api.printify.com/v1/shops/' + PRINTIFY_SHOP_ID + '/products.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        },
        body: JSON.stringify({
            "title": "Product",
            "description": "Good product",
            "blueprint_id": 532,
            "print_provider_id": 59,
            "variants": [
                {
                    "id": 68984,
                    "price": 3172,
                    "is_enabled": true
                }
            ],
            "print_areas": [
                {
                    "variant_ids": [68984],
                    "placeholders": [
                        {
                            "position": "front",
                            "images": [
                                {
                                    "id": req.body.image.id,
                                    "name": "imgpng.png",
                                    "type": "image/png",
                                    "height": req.body.image.height,
                                    "width": req.body.image.width,
                                    "x": 0.5,
                                    "y": 0.5,
                                    "scale": 1,
                                    "angle": 0
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }));
    // Get mug preview images
    const puzzlePreview = yield puzzleRequest.json();
    return puzzlePreview;
}));
// Test Printify endpoint
app.get('/getShops', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('https://api.printify.com/v1/shops.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        }
    });
    // Print the body of the response
    res.send(yield response.json());
}));
// Test Printify uploads endpoint
app.get('/getUploads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('https://api.printify.com/v1/uploads.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        }
    });
    // Print the body of the response
    res.send(yield response.json());
}));
// Test Printify products endpoint
app.get('/getProducts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('https://api.printify.com/v1/shops/' + PRINTIFY_SHOP_ID + '/products.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        }
    });
    // Print the body of the response
    res.send(yield response.json());
}));
/** Obsolete
// Returns mug preview images for a given prompt
app.post('/promptToMug', async (req, res) => {
  const mugPreview = await promptToMug(req.body.prompt);
  res.send(mugPreview.images.map((img: any) => img.src));
})

// Returns puzzle preview images for a given prompt
app.post('/promptToPuzzle', async (req, res) => {
  const puzzlePreview = await promptToPuzzle(req.body.prompt);
  res.send(puzzlePreview.images.map((img: any) => img.src));
})


const promptToMug = async (prompt: any) => {

  // Generate an image based on the prompt provided
  const dalleRequest = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1792x1024",
  });

 const imageUrl = dalleRequest.data[0].url;
 console.log("dalle image url: " + imageUrl)


 // Upload the image to Printify
 const imageRequest = await fetch('https://api.printify.com/v1/uploads/images.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
  },
  body: JSON.stringify({
    "file_name": "image.png",
    "url": imageUrl
  })
})

const image = await imageRequest.json()
console.log("Printify image url: " + image.preview_url)


// Create a mug with the image on Printify

const mugRequest = await (fetch('https://api.printify.com/v1/shops/' + PRINTIFY_SHOP_ID + '/products.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
    },
    body: JSON.stringify({
      "title": "Product",
      "description": "Good product",
      "blueprint_id": 478,
      "print_provider_id": 28,
      "variants": [
            {
                "id": 65216,
                "price": 400,
                "is_enabled": true
            }],
      "print_areas": [
        {
          "variant_ids": [65216],
          "placeholders": [
            {
              "position": "front",
              "images": [
                  {
                    "id": image.id,
                    "name": "imgpng.png",
                    "type": "image/png",
                    "height": image.height,
                    "width": image.width,
                    "x": 0.5,
                    "y": 0.5,
                    "scale": 1,
                    "angle": 0
                  }
              ]
            }
          ]
        }
      ]
    })
  }))


  // Get mug preview images
  const mugPreview = await mugRequest.json()
  return mugPreview
}


const promptToPuzzle = async (prompt: any) => {

  // Generate an image based on the prompt provided
  const dalleRequest = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

 const imageUrl = dalleRequest.data[0].url;
 console.log("dalle image url: " + imageUrl)


 // Upload the image to Printify
 const imageRequest = await fetch('https://api.printify.com/v1/uploads/images.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
  },
  body: JSON.stringify({
    "file_name": "image.png",
    "url": imageUrl
  })
})

const image = await imageRequest.json()
console.log("Printify image url: " + image.preview_url)


// Create a mug with the image on Printify

const puzzleRequest = await (fetch('https://api.printify.com/v1/shops/' + PRINTIFY_SHOP_ID + '/products.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
    },
    body: JSON.stringify({
      "title": "Product",
      "description": "Good product",
      "blueprint_id": 532,
      "print_provider_id": 59,
      "variants": [
            {
                "id": 68984,
                "price": 3172,
                "is_enabled": true
            }],
      "print_areas": [
        {
          "variant_ids": [68984],
          "placeholders": [
            {
              "position": "front",
              "images": [
                  {
                    "id": image.id,
                    "name": "imgpng.png",
                    "type": "image/png",
                    "height": image.height,
                    "width": image.width,
                    "x": 0.5,
                    "y": 0.5,
                    "scale": 1,
                    "angle": 0
                  }
              ]
            }
          ]
        }
      ]
    })
  }))


  // Get mug preview images
  const puzzlePreview = await puzzleRequest.json()
  return puzzlePreview
}
*/
// Export app
exports.default = app;
