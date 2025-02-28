import { theCount } from "../theCountApi.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function extract(req, res) {
  try {
    const {
      data: { data: extractedData },
    } = await theCount.post("/extract", req.body, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

    res.json(extractedData);
  } catch (e) {
    res.status(500).json({ e });
    return;
  }
}
