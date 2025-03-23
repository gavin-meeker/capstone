import { theCount } from "../theCountApi.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export default async function extract(req, res) {
  try {
    console.log("Making request to count-fakeula API with:", {
      url: "/extract",
      bodyType: typeof req.body,
      bodyLength: req.body ? req.body.length : 0,
    });

    const response = await theCount.post("/extract", req.body, {
      headers: {
        "Content-Type": "text/plain",
      },
      auth: {
        username: "user",
        password: "pass",
      },
    });

    console.log("Response from count-fakeula API:", {
      status: response.status,
      hasData: !!response.data,
    });

    res.json(response.data.data || response.data);
  } catch (e) {
    console.error("Error in extract handler:", e.message);
    console.error("Full error:", {
      status: e.response?.status,
      statusText: e.response?.statusText,
      data: e.response?.data,
    });

    if (e.response && e.response.status === 404) {
      res.send(undefined);
      return;
    }

    res.status(500).json({
      error: e.message,
      details: e.response?.data || "No additional details",
    });
  }
}
