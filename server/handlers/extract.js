import { theCount } from "../theCountApi.js";

/**
 * Handler for extracting IOCs from text
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
export default async function extract(req, res, next) {
  try {
    // Ensure we have a body to send
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Request body is empty. Please provide text with potential IOCs."
      });
    }

    // Add request query parameters for defanging if needed
    const queryParams = new URLSearchParams(req.query).toString();
    const url = queryParams ? `/extract?${queryParams}` : "/extract";

    console.log("Making request to Count-FAKEula API:", {
      url,
      bodyLength: req.body.length,
      firstChars: req.body.substring(0, 30) + "...",
    });

    // Make the request to Count-FAKEula
    const response = await theCount.post(url, req.body, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

    // Process the response
    console.log("Response from Count-FAKEula:", {
      status: response.status,
      dataCount: response.data?.data?.length || 0,
    });

    // Return the data
    res.json(response.data.data || []);
  } catch (err) {
    console.error("Error in extract handler:", err.message);

    // Handle 404 differently - it's not an error for this endpoint
    if (err.response && err.response.status === 404) {
      return res.json([]);
    }

    // Send error to error handler middleware
    next(err);
  }
}