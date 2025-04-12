const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;


let tripsData = {};
let citiesData = {};

try {
  const tripsdata = fs.readFileSync("./data/trips-data.json", "utf8");
  const citiesdata = fs.readFileSync("./data/cities.json", "utf8");
  const destinationsData = fs.readFileSync("./data/destinations.json", "utf8");
  tripsData = JSON.parse(tripsdata);
  citiesData = JSON.parse(citiesdata);
  destinations = JSON.parse(destinationsData);
  console.log("JSON data loaded successfully.");
} catch (error) {
  console.error("Error loading JSON data:", error.message);
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/cities", (req, res) => {
    citiesData ?
      res.json(citiesData)
      :
      res.status(404).json({ error: "Data not found for the specified dep and arv" });
  });


app.get("/trips", (req, res) => {
  const { dep, arv } = req.query;

  if (!dep || !arv) {
    return res.status(400).json({ error: "Missing dep or arv parameters" });
  }

  const key = `${dep}:${arv}`;

  if (tripsData[key]) {
    res.json(tripsData[key]);
  } else {
    res.status(404).json({ error: "Data not found for the specified dep and arv" });
  }
});

app.get("/destinations", (req, res) => {
  const { limit } = req.query;
  if (!limit) {
    res.json(destinations);
  } else {
    const newArray = destinations.slice(0, Math.min(limit, destinations.length));
    res.json(newArray);
  }
});

app.get("/trip", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "trip.html"));
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
