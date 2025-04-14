import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Ioc, SecurityLog, LogSource } from "../types";
import { Spinner, Typography } from "@material-tailwind/react";

type SecurityLogDisplayProps = {
  ioc: Ioc;
};

// List of security log sources to include
const SECURITY_SOURCES: LogSource[] = ["azure", "okta", "prisma", "helios", "email", "suricata"];

const SecurityLogDisplay: React.FC<SecurityLogDisplayProps> = ({ ioc }) => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clean IOC key to handle URLs and other special formats
  function cleanIocKey(raw: string): string {
    try {
      // Try to parse as URL
      const url = new URL(raw);
      return url.hostname; // strips protocol + path from URLs
    } catch {
      return raw; // not a URL, use as-is (e.g., IP, email)
    }
  }

  const rawIocKey = ioc?.threat?.indicator?.description || ioc?.key;
  const iocKey = rawIocKey ? cleanIocKey(rawIocKey) : undefined;

  useEffect(() => {
    if (!iocKey) return;

    setLogs([]);
    setLoading(true);
    setError(null);

    const fetchLogs = async () => {
      try {
        // Fetch all logs for this IOC
        const response = await api.post(`/thecount/oil/${iocKey}`);
        const allLogs = response.data || [];

        // Process logs for display
        const formattedLogs = allLogs
          // Filter for security-relevant sources (not netflow)
          .filter((log: any) => log.oil !== "netflow")
          // Filter for logs that actually reference our IOC
          .filter((log: any) => {
            // Check if this log references our IOC
            return log.key === iocKey || log.source?.ip === iocKey || log.client?.ipAddress === iocKey;
          })
          // Map to the simple format needed for display
          .map((log: any) => ({
            timestamp: log.timestamp || log["@timestamp"] || "—",
            key: iocKey,
            oil: log.oil || "—"
          }));

        setLogs(formattedLogs);
      } catch (error) {
        console.error("Error fetching security logs:", error);
        setError("Failed to load security logs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [iocKey]);

  if (!iocKey) return null;
  
  if (loading) {
    return (
      <div className="flex justify-center my-2">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  
  if (error) {
    return <Typography className="text-red-600">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h5" className="mb-2 text-gray-900 font-medium">
        Security Logs for IOC: {iocKey}
      </Typography>
      
      {logs.length === 0 ? (
        <Typography className="text-gray-700 italic">
          No security logs found for this indicator.
        </Typography>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border-b border-gray-300 text-gray-800 font-medium">Timestamp</th>
                <th className="py-2 px-3 border-b border-gray-300 text-gray-800 font-medium">Key</th>
                <th className="py-2 px-3 border-b border-gray-300 text-gray-800 font-medium">Oil</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {logs.map((log, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-1 px-3">{log.timestamp}</td>
                  <td className="py-1 px-3">{log.key}</td>
                  <td className="py-1 px-3">{log.oil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SecurityLogDisplay;