import { Parser } from "@json2csv/plainjs";
import { theCount } from "../theCountApi.js";

// try {
//   const parser = new Parser();
//   const csv = parser.parse(myData);
//   console.log(csv);
// } catch (err) {
//   console.error(err);
// }
/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export default async function iocsToCsv(req, res) {
  const shouldDefang = req.query.defang === "true";

  try {
    const {
      data: { data: extractedData },
    } = await theCount.post(
      `/extract${shouldDefang ? "?defang=true" : ""}`,
      req.body,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      },
    );
    res.json(extractedData);
  } catch (e) {
    //TODO: need to figure out a way to handle sending data back cleanly
    if (e.status === 404) {
      res.send(undefined);
      return;
    }
    res.status(500).json({ error: e });
  }
}
