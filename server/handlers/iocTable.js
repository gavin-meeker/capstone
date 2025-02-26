import { theCount } from "../theCountApi.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function iocTable(req, res) {
  //TODO: need to refactor to add error handling
  //TODO: need to refactor to decompose logic
  const {
    data: { data },
  } = await theCount.get("/oil/1.2.3.4");

  let returnItem = {};

  data.forEach((IOC) => {
    Object.hasOwn(returnItem, IOC.oil)
      ? returnItem[IOC.oil]++
      : (returnItem[IOC.oil] = 1);
  });

  res.send(returnItem);
}
