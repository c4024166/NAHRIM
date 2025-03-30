const db = require("../config/db");
const axios = require("axios");
const cron = require("node-cron");
const xml2js = require("xml2js");

const MET_RSS_URL = "https://www.met.gov.my/rss/forecast-general.xml";

// 1. Fetch MET forecast and insert into DB
const fetchAndInsertMetData = async (req, res) => {
  try {
    const response = await axios.get(MET_RSS_URL);
    const parser = new xml2js.Parser();
    
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error("XML parsing error:", err.message);
        return res.status(500).json({ error: "Failed to parse XML data" });
      }

      const items = result.rss.channel[0].item;

      // Insert each forecast item into DB
      items.forEach((item) => {
        const title = item.title[0];
        const description = item.description[0];
        const pubDate = new Date(item.pubDate[0]);

        const query = "INSERT INTO met_forecast (title, description, pubDate) VALUES (?, ?, ?)";
        db.query(query, [title, description, pubDate], (err) => {
          if (err) {
            console.error("DB insert error:", err.message);
          }
        });
      });

      res.json({ message: "MET forecast data inserted successfully" });
    });

  } catch (err) {
    console.error("MET fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch MET Malaysia data" });
  }
};

// 2. Schedule to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log("Running scheduled MET data fetch...");
  fetchAndInsertMetData({ }, { status: () => ({ json: () => { } }) });
});

// 3. Retrieve data for frontend
const getMetData = (req, res) => {
  const query = "SELECT * FROM met_forecast ORDER BY pubDate DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("DB fetch error:", err.message);
      return res.status(500).json({ error: "Failed to retrieve MET data" });
    }

    res.json(results);
  });
};

module.exports = { fetchAndInsertMetData, getMetData };
