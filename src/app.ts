import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { JSONSchema } from 'openai/lib/jsonschema';
require('dotenv').config();


// Create Express server
const app = express();
const port = 3000; 
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})
const stripe = require('stripe')(process.env['STRIPE_SECRET_KEY']);
const stripeWebhookSecret = process.env['STRIPE_WH_SECRET']

// Printify constants
const PRINTIFY_SHOP_ID = "15300573";

// Express configuration
app.use(cors()); // Enable CORS
var bodyParser = require('body-parser')
// app.use(bodyParser.json())


// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
})

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello world')
})


// Generate an image for a given prompt using DALLE
app.post('/generateImage', bodyParser.json(), async (req, res) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: req.body.prompt,
    n: 1,
    size: "1792x1024",
  });

 const image = response.data;

 res.send(image);
})


// Upload image to Printify
app.post('/uploadImage', bodyParser.json(), async (req, res) => {

  const response = await fetch('https://api.printify.com/v1/uploads/images.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
    },
    body: JSON.stringify({
      "file_name": "image.png",
      "url": req.body.url
    })
  })

  // Print the body of the response
  res.send(await response.json())

})


// Create a mug product on Printify based on an uploaded image
app.post('/createMug', bodyParser.json(), async (req, res) => {
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
  }))


  // Get mug preview images
  const mugPreview = await mugRequest.json() 
  res.send(mugPreview)
})


// Create a puzzle product on Printify based on an uploaded image
app.post('/createPuzzle', bodyParser.json(), async (req, res) => {
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
  }))


  // Get mug preview images
  const puzzlePreview = await puzzleRequest.json() 
  res.send(puzzlePreview)
})


app.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  const payload = req.body;

  const sig = req.headers['stripe-signature']
  const endpointSecret = 'whsec_b164e68e873b8c17b6fa6b632ee195fbce1d0c983e96dc573ac047b98b883eaf'

  let event; 

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.log(err)
    return res.status(400).send('Webhook error: ${err.message}');
  }

  if (event.type == 'checkout.session.completed') {
    console.log("client_reference_id: " + event.data.object.client_reference_id)

    //TODO: process printify order

  
  }

  res.status(200).end();
})


// Test Printify endpoint
app.get('/getShops', async (req, res) => {
  
  const response = await fetch('https://api.printify.com/v1/shops.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
    }
  })

  // Print the body of the response
  res.send(await response.json())
})


// Test Printify uploads endpoint
app.get('/getUploads', async (req, res) => {

  const response = await fetch('https://api.printify.com/v1/uploads.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
    }
  })

  // Print the body of the response
  res.send(await response.json())
})


// Test Printify products endpoint
app.get('/getProducts', async (req, res) => {

  const response = await fetch('https://api.printify.com/v1/shops/' + PRINTIFY_SHOP_ID + '/products.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
    }
  })

  // Print the body of the response
  res.send(await response.json())

})









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



PAYMENTS
https://docs.stripe.com/payments/checkout/fulfill-orders


*/











// Export app
export default app;





