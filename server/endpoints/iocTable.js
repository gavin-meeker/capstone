import axios from "axios";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function iocTable(req, res) {
  //TODO: need to refactor to add error handling
  //TODO: need to refactor to decompose logic
  const {
    data: { data },
  } = await axios.get("http://localhost:7000/oil/1.2.3.4", {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString("base64")}`,
    },
  });

  let returnItem = {};
  data.forEach((IOC) => {
    Object.hasOwn(returnItem, IOC.oil)
      ? returnItem[IOC.oil]++
      : (returnItem[IOC.oil] = 1);
  });

  res.send(returnItem);
}
