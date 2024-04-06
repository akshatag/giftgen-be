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
app.post('/promptToMug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mugPreview = yield promptToMug(req.body.prompt);
    res.send(mugPreview.images.map((img) => img.src));
}));
app.post('/promptToPuzzle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const puzzlePreview = yield promptToPuzzle(req.body.prompt);
    res.send(puzzlePreview.images.map((img) => img.src));
}));
// Test Dalle create img endpoint 
app.get('/img', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield openai.images.generate({
        model: "dall-e-3",
        prompt: "a cute cat wearing a hat",
        n: 1,
        size: "1792x1024",
    });
    const image_url = response.data;
    res.send(image_url);
}));
// Test Printify endpoint
app.get('/getShop', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// Upload image to Printify
app.get('/uploadImage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('https://api.printify.com/v1/uploads/images.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        },
        body: JSON.stringify({
            "file_name": "image.png",
            "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-s6tZ6QQiqYLslwwXi6GulO9F/user-H0svZz3k8o7q4wKl6lMn5n2x/img-OAPjFSloOjLjxaatZZmizyOR.png?st=2024-04-06T15%3A54%3A24Z&se=2024-04-06T17%3A54%3A24Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-04-05T23%3A45%3A40Z&ske=2024-04-06T23%3A45%3A40Z&sks=b&skv=2021-08-06&sig=OUQ9PhMD7A77/uY0g%2BvN5%2B37QDaFnW2sTclrnOkb04g%3D"
        })
    });
    // Print the body of the response
    res.send(yield response.json());
}));
// Get Printify products
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
// Create a product on Printify
app.get('/createMug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (fetch('https://api.printify.com/v1/shops/' + PRINTIFY_SHOP_ID + '/products.json', {
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
    }));
    // Print the body of the response
    res.send(yield response.json());
}));
const promptToMug = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate an image based on the prompt provided
    const dalleRequest = yield openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1792x1024",
    });
    const imageUrl = dalleRequest.data[0].url;
    console.log("dalle image url: " + imageUrl);
    // Upload the image to Printify
    const imageRequest = yield fetch('https://api.printify.com/v1/uploads/images.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        },
        body: JSON.stringify({
            "file_name": "image.png",
            "url": imageUrl
        })
    });
    const image = yield imageRequest.json();
    console.log("Printify image url: " + image.preview_url);
    // Create a mug with the image on Printify
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
    }));
    // Get mug preview images
    const mugPreview = yield mugRequest.json();
    return mugPreview;
});
const promptToPuzzle = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate an image based on the prompt provided
    const dalleRequest = yield openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    });
    const imageUrl = dalleRequest.data[0].url;
    console.log("dalle image url: " + imageUrl);
    // Upload the image to Printify
    const imageRequest = yield fetch('https://api.printify.com/v1/uploads/images.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + process.env['PRINTIFY_API_KEY']
        },
        body: JSON.stringify({
            "file_name": "image.png",
            "url": imageUrl
        })
    });
    const image = yield imageRequest.json();
    console.log("Printify image url: " + image.preview_url);
    // Create a mug with the image on Printify
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
    }));
    // Get mug preview images
    const puzzlePreview = yield puzzleRequest.json();
    return puzzlePreview;
});
// Export app
exports.default = app;
