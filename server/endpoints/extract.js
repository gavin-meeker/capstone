import axios from "axios";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function extract(req, res) {
  const {
    data: { data },
  } = await axios.post("http://localhost:7000/extract", req.body, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString("base64")}`,
      "Content-Type": "text/plain",
    },
  });

  res.json(data);
}
