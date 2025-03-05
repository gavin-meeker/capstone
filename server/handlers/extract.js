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
    //TODO: need to figure out a way to handle sending data back cleanly
    if (e.status === 404) {
      res.send(undefined);
      return;
    }
    res.status(500).json({ e });
  }
  return;
}
