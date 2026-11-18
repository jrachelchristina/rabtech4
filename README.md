# ShopLite — Dynamic JavaScript DOM Logic & RESTful API Client

A responsive product explorer built with vanilla JavaScript ES6 modules. It uses the public [Fake Store API](https://fakestoreapi.com/) to load live product and category data.

## Features

- Asynchronous `fetch()` calls with `async/await`
- `Promise.all()` to load products and categories together
- Dynamic product cards created with DOM methods
- Live search across product titles and descriptions
- Category filter tabs
- Sorting by price, name, and rating
- Cart quantity saved in `localStorage`
- Loading skeletons, friendly error banner, and retry button
- Responsive layout for desktop, tablet, and mobile

## Project structure

```text
dynamic-js-rest-api-client/
├── index.html
├── style.css
├── app.js
├── api.js
└── README.md
```

## Run locally

Because the project uses JavaScript ES modules, run it through a local development server rather than opening `index.html` directly.

### Option 1: VS Code Live Server
1. Open this folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` and choose **Open with Live Server**.

### Option 2: Python
Open a terminal in this folder and run:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## API endpoints

- `https://fakestoreapi.com/products`
- `https://fakestoreapi.com/products/categories`

## GitHub submission

1. Create a public GitHub repository, for example `dynamic-js-rest-api-client`.
2. Extract this ZIP and upload all project files, or push the folder using Git.
3. Confirm that `app.js` and `api.js` are visible in the repository.
4. Submit the public repository URL.

## Notes

The cart is a client-side demo: it stores product IDs and quantities in this browser only. It does not process payments or create server-side orders.
