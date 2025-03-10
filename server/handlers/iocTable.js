import { theCount } from "../theCountApi.js";

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export default async function iocTable(req, res) {
  //TODO: need to refactor to add error handling
  if (req.body.threat.indicator.type == "file") {
    res.status(200).send(undefined);
    return;
  }

  try {
    const {
      data: { data: oilData },
    } = await theCount.get(`/oil/${req.body.threat.indicator.description}`);

    res.send(oilData);
  } catch (e) {
    if (e.status === 404) {
      // ok because because the count just did not find anything
      res.status(200).send(undefined);
    } else {
      res.status(500).send(e.message);
    }
  }
}
