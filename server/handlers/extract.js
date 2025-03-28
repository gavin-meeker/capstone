import { theCount } from "../theCountApi.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function extract(req, res) {
  let queryString = "";

  Object.entries(req.query).forEach(([key, value]) => {
    queryString += `${key}=${value}&`;
  });

  try {
    const {
      data: { data: extractedData },
    } = await theCount.post(`/extract?${queryString}`, req.body, {
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
}
