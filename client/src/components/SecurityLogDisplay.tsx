import { api } from "../utils/api";
import { Ioc } from "../types.ts";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type SecurityLogDisplayProps = {
  ioc: Ioc;
};

type SecurityLog = {
  timestamp: string;
  key: string;
  logType: string;
};

const SECURITY_SOURCES = ["azure", "okta", "prisma", "helios", "email"];

/* Added Styling */
const retroFont: React.CSSProperties = { fontFamily: "monospace" };
const retroGreen: React.CSSProperties = { color: "#00ff00" };
const darkBackground: React.CSSProperties = { backgroundColor: "#000000" };
const darkSeparator: React.CSSProperties = { borderBottom: "1px solid #333" };
const greenSeparator: React.CSSProperties = {
  borderBottom: "1px solid #00ff00",
};
const tableSpacing: React.CSSProperties = { padding: "0.5rem" };
const leftAlign: React.CSSProperties = { textAlign: "left" };
const smallFontSize: React.CSSProperties = { fontSize: "0.8rem" };
const marginTopSmall: React.CSSProperties = { marginTop: "0.5rem" };
const collapseBorders: React.CSSProperties = { borderCollapse: "collapse" };
const fullWidth: React.CSSProperties = { width: "100%" };

const SecurityLogDisplay = ({ ioc }: SecurityLogDisplayProps) => {
  const iocKey = getIocKey(ioc);

  const { data, isPending } = useQuery({
    queryKey: ["securityLogs", iocKey],
    queryFn: () => api.post(`thecount/oil/${iocKey}`),
  });

  const filteredLogs =
    data?.data &&
    data?.data
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
      .map(
        (log: any): SecurityLog => ({
          timestamp: log.timestamp || log["@timestamp"] || "—",
          key: iocKey, // ✅ Override key to show searched IOC
          logType: log.oil || "—",
        }),
      );

  if (!iocKey)
    return (
      <p style={{ ...retroFont, ...retroGreen }}>⚠️ No IOC key provided.</p>
    );
  if (isPending)
    return <p style={{ ...retroFont, ...retroGreen }}>Loading logs...</p>;

  return (
    <div style={{ ...darkBackground, padding: "1rem" }}>
      <h3 style={{ ...retroFont, ...retroGreen }}>Security Logs</h3>
      {filteredLogs.length === 0 ? (
        <p style={{ ...retroFont, ...retroGreen }}>
          No security logs affiliated with this IOC.
        </p>
      ) : (
        <table
          style={{
            ...retroFont,
            ...retroGreen,
            ...collapseBorders,
            ...fullWidth,
            ...marginTopSmall,
            ...smallFontSize,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  ...retroFont,
                  ...retroGreen,
                  ...greenSeparator,
                  ...tableSpacing,
                  ...leftAlign,
                }}
              >
                Timestamp
              </th>
              <th
                style={{
                  ...retroFont,
                  ...retroGreen,
                  ...greenSeparator,
                  ...tableSpacing,
                  ...leftAlign,
                }}
              >
                Key
              </th>
              <th
                style={{
                  ...retroFont,
                  ...retroGreen,
                  ...greenSeparator,
                  ...tableSpacing,
                  ...leftAlign,
                }}
              >
                Oil
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log: SecurityLog) => (
              <tr key={log.key + log.logType}>
                <td
                  style={{
                    ...retroFont,
                    ...retroGreen,
                    ...darkSeparator,
                    ...tableSpacing,
                  }}
                >
                  {log.timestamp}
                </td>
                <td
                  style={{
                    ...retroFont,
                    ...retroGreen,
                    ...darkSeparator,
                    ...tableSpacing,
                  }}
                >
                  {log.key}
                </td>
                <td
                  style={{
                    ...retroFont,
                    ...retroGreen,
                    ...darkSeparator,
                    ...tableSpacing,
                  }}
                >
                  {log.logType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
function getIocKey(ioc: Ioc): string {
  const rawIocKey = ioc?.threat?.indicator?.description;
  if (rawIocKey) {
    try {
      const url = new URL(rawIocKey);
      return url.hostname; // strips protocol + path from URLs
    } catch {
      return rawIocKey; // not a URL, use as-is (e.g., IP, email)
    }
  }
  return "";
}

export default SecurityLogDisplay;
