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

  const {
    data: { data: extractedData },
  } = await theCount.post(`/extract?${queryString}`, req.body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  res.json(extractedData);
}
