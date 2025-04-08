export default function errorHandler(err, req, res, next) {
  console.error("Error occurred:", err);

  if (err.isAxiosError) {
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (err.response?.status >= 400 && err.response?.status < 500) {
      return res.status(err.response.status).json({
        message: err.response.data?.message || `Request error: ${err.message}`,
        details: err.response.data?.details,
      });
    }
    return res
      .status(500)
      .json({ message: "Error communicating with theCount service" });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal server error" });
}
