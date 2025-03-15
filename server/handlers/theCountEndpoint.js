import { theCount } from "../theCountApi.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function theCountEndpoint(req, res) {
  const theCountParams = req.params["0"];
  try {
    const {
      data: { data: extractedData },
    } = await theCount.get("/" + theCountParams);
    res.json(extractedData);
  } catch (e) {
    //TODO: need to figure out a way to handle sending data back cleanly
    if (e.status === 404) {
      res.send(undefined);
      return;
    }
    res.status(500).json({ error: e });
  }
  return;
}
