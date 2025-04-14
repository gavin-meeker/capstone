import { theCount } from "../theCountApi.js";

/**
 * Handler for retrieving security logs for an IOC
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
export default async function iocTable(req, res, next) {
  try {
    // Validate the request body contains IOC information
    if (!req.body || !req.body.threat || !req.body.threat.indicator) {
      return res.status(400).json({
        error: true,
        message: "Invalid request body. Missing IOC information." 
      });
    }

    const iocType = req.body.threat.indicator.type;
    const iocValue = req.body.threat.indicator.description;

    console.log(`Processing IOC lookup request for ${iocType}: ${iocValue}`);

    // Skip file hash IOCs as they're not supported by the OIL API
    if (iocType === "file") {
      console.log("File type IOCs are not supported for security log lookup");
      return res.json([]);
    }

    // Make the request to Count-FAKEula's OIL API
    const response = await theCount.get(`/oil/${iocValue}`);
    
    // Check if we got valid data back
    if (!response.data || !response.data.data) {
      console.log(`No OIL data found for ${iocValue}`);
      return res.json([]);
    }

    // Return the data
    res.json(response.data.data);
  } catch (err) {
    console.error("Error in iocTable handler:", err.message);
    
    // Handle 404 differently - it's not an error for this endpoint
    if (err.response && err.response.status === 404) {
      return res.json([]);
    }
    
    // Send to error handler middleware
    next(err);
  }
}