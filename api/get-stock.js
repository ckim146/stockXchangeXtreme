import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  const { symbol, timeSeries } = req.query;
  const apiKey = process.env.ALPHA_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing" });
  }

  const url = `https://www.alphavantage.co/query?function=${timeSeries}&symbol=${symbol}&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
    console.log(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}
