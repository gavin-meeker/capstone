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
    } = await theCount.get(`/oil/${req.query.ioc}`);

    const responseObject = buildReturnObject(oilData);

    res.send(responseObject);
  } catch (e) {
    //TODO: need to figure out a way to handle sending data back cleanly
    if (e.code === 404) {
      res.send(undefined);
    } else {
      res.status(200).send(undefined);
    }
  }
}

function buildReturnObject(oilData) {
  return oilData.reduce((acc, IOC) => {
    acc[IOC.oil] = (acc[IOC.oil] || 0) + 1;
    return acc;
  }, {});
}
