import { theCount } from "../theCountApi.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function iocTable(req, res) {
  //TODO: need to refactor to add error handling
  try {
    const {
      data: { data: oilData },
    } = await theCount.get("/oil/1.2.3.4");

    const responseObject = buildReturnObject(oilData);

    res.send(responseObject);
  } catch (e) {
    res.status(500).send(e);
  }
}

function buildReturnObject(oilData) {
  return oilData.reduce((acc, IOC) => {
    acc[IOC.oil] = (acc[IOC.oil] || 0) + 1;
    return acc;
  }, {});
}
