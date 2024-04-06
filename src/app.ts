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

// Printify constants
const PRINTIFY_SHOP_ID = "15300573";

// Express configuration
app.use(cors()); // Enable CORS

// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
})

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello world')
})


app.get('/test', async (req, res) => {
 
  const mugPreview = await promptToMug('two bros hacking away feverishly on a couch');
  res.send(mugPreview.images.map((img: any) => img.src));
})


// Test Dalle create img endpoint 
app.get('/img', async (req, res) => {

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "a cute cat wearing a hat",
    n: 1,
    size: "1792x1024",
  });

 const image_url = response.data;

  res.send(image_url);
})


// Test Printify endpoint
app.get('/getShop', async (req, res) => {
  
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



// Upload image to Printify
app.get('/uploadImage', async (req, res) => {

  const response = await fetch('https://api.printify.com/v1/uploads/images.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
    },
    body: JSON.stringify({
      "file_name": "image.png",
      "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-s6tZ6QQiqYLslwwXi6GulO9F/user-H0svZz3k8o7q4wKl6lMn5n2x/img-OAPjFSloOjLjxaatZZmizyOR.png?st=2024-04-06T15%3A54%3A24Z&se=2024-04-06T17%3A54%3A24Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-04-05T23%3A45%3A40Z&ske=2024-04-06T23%3A45%3A40Z&sks=b&skv=2021-08-06&sig=OUQ9PhMD7A77/uY0g%2BvN5%2B37QDaFnW2sTclrnOkb04g%3D"
    })
  })

  // Print the body of the response
  res.send(await response.json())

})

// Get Printify products
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


// Create a product on Printify
app.get('/createMug', async (req, res) => {
  
  const response = await (fetch('https://api.printify.com/v1/shops/' + PRINTIFY_SHOP_ID + '/products.json', {
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
                    "id": "66118010d81d1747e4c0fbf9",
                    "name": "imgpng.png",
                    "type": "image/png",
                    "height": 1792,
                    "width": 1024,
                    "x": 0.49565896470329024,
                    "y": 0.5232559581916211,
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


  // Print the body of the response
  res.send(await response.json())

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









// Export app
export default app;





  // {
  //   "title": "Product",
  //   "description": "Good product",
  //   "blueprint_id": 384,
  //   "print_provider_id": 1,
  //   "variants": [
  //         {
  //             "id": 45740,
  //             "price": 400,
  //             "is_enabled": true
  //         },
  //         {
  //             "id": 45742,
  //             "price": 400,
  //             "is_enabled": true
  //         },
  //         {
  //             "id": 45744,
  //             "price": 400,
  //             "is_enabled": false
  //         },
  //         {
  //             "id": 45746,
  //             "price": 400,
  //             "is_enabled": false
  //         }
  //     ],
  //     "print_areas": [
  //       {
  //         "variant_ids": [45740,45742,45744,45746],
  //         "placeholders": [
  //           {
  //             "position": "front",
  //             "images": [
  //                 {
  //                   "id": "5d15ca551163cde90d7b2203", 
  //                   "x": 0.5, 
  //                   "y": 0.5, 
  //                   "scale": 1,
  //                   "angle": 0
  //                 }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  // }