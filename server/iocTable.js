import fetch from "node-fetch";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function iocTable(req, res) {
  const result = await fetch("http://localhost:7000/oil/1.2.3.4", {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString("base64")}`,
    },
  });
  let returnItem = {};
  let json = await result.json();
  json.data.forEach((IOC) => {
    Object.hasOwn(returnItem, IOC.oil)
      ? returnItem[IOC.oil]++
      : (returnItem[IOC.oil] = 1);
  });
  res.send(returnItem);
}

function getIocOilData(ioc) {}
