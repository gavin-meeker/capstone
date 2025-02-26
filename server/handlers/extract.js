import { theCount } from "../theCountApi.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function extract(req, res) {
  let data;
  try {
    data = await theCount.post("/extract", req.body, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (e) {
    res.status(500).send({ e });
    return;
  }

  res.json(data.data.data);
}
