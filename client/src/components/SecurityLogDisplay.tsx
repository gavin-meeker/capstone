import React, { useEffect, useState } from "react";
import { api } from "../utils/api";

const SOURCES = ["azure", "okta", "prisma", "helios", "email"];

type SecurityLogsDisplayProps = {
  ioc: any; // Ideally use your actual Ioc type
};

const SecurityLogsDisplay: React.FC<SecurityLogsDisplayProps> = ({ ioc }) => {
  const [logsBySource, setLogsBySource] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const iocKey = ioc?.key || ioc?.threat?.indicator?.description;

  useEffect(() => {
    if (!iocKey) {
      console.warn("⚠️ No IOC key provided");
      return;
    }

    const fetchLogs = async () => {
      setLoading(true);
      const logsMap: Record<string, any[]> = {};

      await Promise.all(
        SOURCES.map(async (source) => {
          try {
            const path = `/oil/${source}/${iocKey}`;
            console.log(`🔍 Fetching: ${path}`);
            const response = await api.get(path);
            logsMap[source] = response?.data || [];
          } catch (err) {
            console.warn(`❌ Failed for ${source}:`, err);
            logsMap[source] = [];
          }
        }),
      );

      setLogsBySource(logsMap);
      setLoading(false);
    };

    fetchLogs();
  }, [iocKey]);

  if (!iocKey) return <p>⚠️ No IOC selected.</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Security Logs for: <code>{iocKey}</code>
      </h3>

      {loading ? (
        <p>Loading logs...</p>
      ) : (
        SOURCES.map((source) => (
          <div key={source}>
            <h4 className="text-md mb-1 font-bold">
              {logsBySource[source]?.length
                ? `✅ ${source.toUpperCase()}`
                : `❌ ${source.toUpperCase()} — No logs found`}
            </h4>

            {logsBySource[source]?.length > 0 && (
              <ul className="ml-4 list-disc text-sm">
                {logsBySource[source].map((log, idx) => (
                  <li key={idx}>
                    <pre className="whitespace-pre-wrap break-all rounded bg-gray-100 p-2">
                      {JSON.stringify(log, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SecurityLogsDisplay;
