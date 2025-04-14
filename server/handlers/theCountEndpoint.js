import { theCount } from "../theCountApi.js";

/**
 * Generic proxy handler for Count-FAKEula API endpoints
 * 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
export default async function theCountEndpoint(req, res, next) {
  // Extract the Count-FAKEula endpoint path from the request
  const theCountPath = req.params["0"];
  
  if (!theCountPath) {
    return res.status(400).json({
      error: true,
      message: "Missing Count-FAKEula endpoint path"
    });
  }

  try {
    console.log(`Proxying request to Count-FAKEula: ${req.method} /${theCountPath}`);
    
    let response;
    
    // Handle different HTTP methods
    if (req.method === "GET") {
      // Forward any query parameters
      const queryParams = new URLSearchParams(req.query).toString();
      const url = queryParams ? `/${theCountPath}?${queryParams}` : `/${theCountPath}`;
      
      response = await theCount.get(url);
    } else if (req.method === "POST") {
      // Handle different content types
      const contentType = req.headers['content-type'];
      const options = {};
      
      if (contentType) {
        options.headers = { 'Content-Type': contentType };
      }
      
      // Forward any query parameters
      const queryParams = new URLSearchParams(req.query).toString();
      const url = queryParams ? `/${theCountPath}?${queryParams}` : `/${theCountPath}`;
      
      response = await theCount.post(url, req.body, options);
    } else {
      return res.status(405).json({
        error: true,
        message: `Method ${req.method} not supported for Count-FAKEula proxy`
      });
    }
    
    // Process the response
    if (response.data && response.data.data) {
      console.log(`Successful response from Count-FAKEula for /${theCountPath}`);
      return res.json(response.data.data);
    } else {
      console.log(`Empty response from Count-FAKEula for /${theCountPath}`);
      return res.json([]);
    }
  } catch (err) {
    console.error(`Error in Count-FAKEula proxy for /${theCountPath}:`, err.message);
    
    // Handle 404 differently - it's not an error for this endpoint
    if (err.response && err.response.status === 404) {
      return res.json([]);
    }
    
    // Send to error handler middleware
    next(err);
  }
}