import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let listings = [
	{
		id: 1,
		title: "Wireless Earbuds",
		description: "Noise-canceling earbuds with long battery life.",
		seller: "Boat",
		rating: 4.5,
	},
	{
		id: 2,
		title: "Fitness Tracker",
		description:
			"Waterproof fitness tracker with heart rate monitor and step counter.",
		seller: "Samsung",
		rating: 4.1,
	},
];

let lastId = 0;

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route: Get ALL listed items
app.get("/listing", (req, res) => {
	res.json({ data: listings });
});

//Route: Get one listed item by id
app.get("/listing/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const item = listings.find((listing) => listing.id === id);

	if (item) {
		res.json({ data: item });
	} else {
		res.status(404).json({ error: "Item not found" });
	}
});

// Route: Update a listed item by ID
app.put("/listing/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const index = listings.findIndex((listing) => listing.id === id);

	if (index != -1) {
		listings[index] = {
			...listings[index],
			...req.body, //only update the fields provided in the request body
		};
		res.json({ data: listings[index] });
	} else {
		res.status(404).json({ error: "item not found" });
	}
});

//Route: Create a new listing
app.post("/listing", (req, res) => {
	const { title, description, seller, rating = null } = req.body;
	const newListing = {
		id: ++lastId,
		title,
		description,
		seller,
		rating,
	};
	listings.push(newListing);
	res.status(201).json({ data: newListing });
});

//Route: Delete a listed item by ID
app.delete("/listing/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const index = listings.findIndex((listing) => listing.id === id);

	if (index != -1) {
		listings.splice(index, 1);
		res.sendStatus(200);
	} else {
		res.status(404).json({ error: "item not found" });
	}
});

app.listen(port, () => {
	console.log(`API is running at http://localhost:${port}`);
});
