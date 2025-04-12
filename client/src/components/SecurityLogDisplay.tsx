import React, { useEffect, useState } from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { api } from "../utils/api";
import { Ioc } from "../types.ts";

type SecurityLogDisplayProps = {
  ioc: Ioc;
};

const SECURITY_SOURCES = ["azure", "okta", "prisma", "helios", "email", "suricata"];

const SecurityLogDisplay: React.FC<SecurityLogDisplayProps> = ({ ioc }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const iocKey = ioc?.threat?.indicator?.description;
  
  useEffect(() => {
    const fetchLogs = async () => {
      if (!iocKey) return;
      
      setLoading(true);
      try {
        console.log("Fetching security logs for:", iocKey);
        const response = await api.get(`/oil/${iocKey}`);
        const allLogs = response.data?.data || [];
        
        console.log("All logs:", allLogs.length);
        
        // Filter logs to include only security sources and where the IOC appears in a key field
        const filteredLogs = allLogs
          .filter((log: any) => SECURITY_SOURCES.includes(log.oil))
          .filter((log: any) => {
            // Check all possible fields where the IOC might appear
            return (
              log.key === iocKey ||
              log.source?.ip === iocKey ||
              log.client?.ip === iocKey || 
              log.client?.ipAddress === iocKey ||
              log.callerIpAddress === iocKey ||
              log.destination?.ip === iocKey ||
              log.email?.to?.address === iocKey ||
              log.email?.from?.address === iocKey ||
              log.userPrincipalName === iocKey ||
              log.user?.email === iocKey
            );
          })
          .map((log: any) => ({
            timestamp: log.timestamp || log["@timestamp"] || "—",
            key: iocKey, // Always show the queried IOC for consistency
            oil: log.oil || "—",
          }));
        
        console.log("Filtered logs:", filteredLogs.length);
        setLogs(filteredLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [iocKey]);

  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div>
      <h3>Security Logs for IOC: <code>{iocKey}</code></h3>
      
      {logs.length === 0 ? (
        <p>No security logs affiliated with this IOC.</p>
      ) : (
        <table className="w-full text-sm table-auto mt-4 border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b">Timestamp</th>
              <th className="text-left p-2 border-b">Key</th>
              <th className="text-left p-2 border-b">Oil</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="p-2 border-b">{log.timestamp}</td>
                <td className="p-2 border-b">{log.key}</td>
                <td className="p-2 border-b">{log.oil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SecurityLogDisplay;