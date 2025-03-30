import { Parser } from "@json2csv/plainjs";
import { theCount } from "../theCountApi.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function iocsToCsv(req, res) {
  const shouldDefang = req.query.defang === "true";
  console.log(req.body);

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

    const parser = new Parser({
      fields: [
        {
          label: "IOC",
          value: "threat.indicator.description",
        },
        {
          label: "IOC Type",
          value: "threat.indicator.type",
        },
      ],
    });
    const csv = parser.parse(extractedData);

    const dateString = formatDate(new Date());

    res.attachment(`ioc_${dateString}.csv`).send(csv);
  } catch (e) {
    //TODO: need to figure out a way to handle sending data back cleanly
    if (e.status === 404) {
      res.send(undefined);
      return;
    }
    res.status(500).json({ error: e });
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}${month}${day}_${hours}${minutes}`;
}
