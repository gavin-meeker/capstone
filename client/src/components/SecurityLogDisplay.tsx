import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Ioc } from "../types.ts";

type SecurityLogDisplayProps = {
  ioc: Ioc;
};

const SECURITY_SOURCES = ["azure", "okta", "prisma", "helios", "email"];

const SecurityLogDisplay: React.FC<SecurityLogDisplayProps> = ({ ioc }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function cleanIocKey(raw: string): string {
    try {
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

    const fetchLogs = async () => {
      try {
        const response = await api.get(`/oil/${iocKey}`);
        const allLogs = response.data?.data || [];

        const filteredLogs = allLogs
          .filter((log: any) => SECURITY_SOURCES.includes(log.oil))
          .filter((log: any) => {
            const valuesToMatch = [
              log.key,
              log.source?.ip,
              log.client?.ip,
              log.email?.to?.address,
              log.userPrincipalName,
              log.user?.email,
            ];
            return valuesToMatch.includes(iocKey);
          })
          .map((log: any) => ({
            timestamp: log.timestamp || log["@timestamp"] || "—",
            key: iocKey, // ✅ Override key to show searched IOC
            oil: log.oil || "—",
          }));

        setLogs(filteredLogs);
      } catch (error) {
        console.error("❌ Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [ioc]); // ✅ Refetch on IOC change

  if (!iocKey) return <p>⚠️ No IOC key provided.</p>;
  if (loading) return <p>Loading logs...</p>;

  return (
    <div>
      <h3>
        Security Logs for IOC: <code>{iocKey}</code>
      </h3>
      {logs.length === 0 ? (
        <p>No security logs affiliated with this IOC.</p>
      ) : (
        <table className="mt-4 w-full table-auto border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Timestamp</th>
              <th className="border-b p-2 text-left">Key</th>
              <th className="border-b p-2 text-left">Oil</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="border-b p-2">{log.timestamp}</td>
                <td className="border-b p-2">{log.key}</td>
                <td className="border-b p-2">{log.oil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SecurityLogDisplay;
