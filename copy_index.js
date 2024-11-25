const express = require("express"); // Import express
const fs = require("fs");
const lists = require("./Item.json");
const { error } = require("console");

const app = express(); //create an instance of express application
const PORT = 3000;

//MIDDLEWARE - Plugin
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

//REST API
app.get("/api/lists", (req, res) => {
	return res.json(lists);
});

//GET /api/users/:id and here :id-> means Variable which is DYNAMIC
//HANDLS dynamic request

app.get("/lists", (req, res) => {
	const html = `
	<ul>
		${lists.map((user) => `<li>${user.name}</li>`)}
	</ul>`;
	res.send(html);
});

app.post("/api/lists", (req, res) => {
	const body = req.body;
	console.log("Received body:", body); // Log the incoming body

	if (!body.name || !body.quantity) {
		return res.status(400).json({ error: "Name and quantity are required" });
	}

	// Add a unique ID to the new item
	const newItem = { ...body, id: lists.length + 1 };
	lists.push(newItem);

	console.log("Updated lists:", lists); // Log the updated lists

	// Write the updated lists to the file
	fs.writeFile("./Item.json", JSON.stringify(lists, null, 2), (err) => {
		if (err) {
			console.error("Error writing to file:", err); // Log any errors
			return res.status(500).json({ error: "Failed to save data" });
		}
		return res
			.status(201)
			.json({ message: "Item added successfully", item: newItem });
	});
});

app
	.route("/api/lists/:id")
	.get((req, res) => {
		const id = parseInt(req.params.id, 10);
		const list = lists.find((list) => list.id === id);
		if (!list) {
			return res.status(404).json({ error: "List not found" });
		}

		return res.json(list);
	})

	.patch((req, res) => {
		//TODO- Edit the item with id
		return res.json({ status: "pending" });
	})

	.put((req, res) => {
		return res.json({ status: "pending" });
	})
	.delete((req, res) => {
		return res.json({ status: "pending" });
	});

//id is the route params here-- which capture dynamic values in the URL
//post----> CREATES new data(shirt here)
//request object in express allows us to access info from the request msg like url paramteers, the body, the header etc

// app.post("/tshirt/:id", (req, res) => {
// 	const { id } = req.params;
// 	const { logo } = req.body;

// 	if (!logo) {
// 		res.status(418).send({ message: "We need a logo" });
// 	}

// 	res.send({
// 		tshirt: `👕 with your ${logo} and ID of ${id}`,
// 	});
// });
