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
  tooltipInfo: string[];
};

const SECURITY_SOURCES = ["azure", "okta", "prisma", "helios", "email"];

/* Added Styling */
const retroFont: React.CSSProperties = { fontFamily: "monospace" };
const retroGreen: React.CSSProperties = { color: "#00ff00" };
const darkBackground: React.CSSProperties = { backgroundColor: "#1e1e1e" };
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

  const extractTooltipInfo = (log: any): string[] => {
    const lines: string[] = [];

    // Extract common and Okta-specific fields using the configuration
    for (const key in tooltipConfig) {
      const config = tooltipConfig[key];
      const value = key.split(".").reduce((obj, k) => obj?.[k], log);
      if (value) {
        lines.push(`${config.label}: ${value}`);
      }
    }

    // Handle the 'target' array specifically
    if (Array.isArray(log.target)) {
      log.target.forEach((t, idx) => {
        if (t.displayName) lines.push(`Target ${idx + 1}: ${t.displayName}`);
        if (t.alternateId)
          lines.push(`Target Email ${idx + 1}: ${t.alternateId}`);
      });
    }

    return lines;
  };

  const filteredLogs: SecurityLog[] =
    data?.data &&
    data?.data
      .filter((log: any) => SECURITY_SOURCES.includes(log.oil))
      .filter((log: any) => {
        const valuesToMatch = [
          log.key,
          log.source?.ip,
          log.client?.ip,
          log.client?.ipAddress,
          log.email?.to?.address,
          log.userPrincipalName,
          log.user?.email,
          log.actor?.alternateId,
        ];
        return valuesToMatch.includes(iocKey);
      })
      .map(
        (log: any): SecurityLog => ({
          timestamp: log.timestamp || log["@timestamp"] || "—",
          key: iocKey,
          logType: log.oil || "—",
          tooltipInfo: extractTooltipInfo(log),
        }),
      );

  if (!iocKey) return <p>No IOC key provided.</p>;
  if (isPending) return <p>Loading logs...</p>;

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
            {filteredLogs.map((log, index) => (
              <tr key={log.key + log.timestamp + log.logType + index}>
                <td className="border-b p-2">{log.timestamp}</td>
                <td className="border-b p-2">{log.key}</td>
                <td className="border-b p-2">
                  <div className="group relative w-max">
                    <span className="cursor-help underline decoration-dotted">
                      {log.logType}
                    </span>
                    {log.tooltipInfo.length > 0 && (
                      <div className="absolute left-0 top-full z-10 mt-1 hidden w-64 rounded border bg-white p-2 text-xs text-black shadow-md group-hover:block">
                        {log.tooltipInfo.map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

type TooltipConfig = {
  [key: string]: {
    label: string;
    path?: string; // Optional path for nested properties
  };
};

const tooltipConfig: TooltipConfig = {
  "email.from.address": { label: "From" },
  "email.to.address": { label: "To" },
  "email.subject": { label: "Subject" },
  "megaoil.pipeline": { label: "Pipeline" },
  "event.module": { label: "Module" },
  "event.message": { label: "Event" },
  userPrincipalName: { label: "Principal" },
  userDisplayName: { label: "User" },
  coxAccountName: { label: "Cox Account" },
  displayName: { label: "Device" },
  "client.ip": { label: "Client IP" },
  "client.asn": { label: "ASN" },
  "Suricata.Signature": { label: "Suricata Sig" },
  "rule.name": { label: "Rule" },
  displayMessage: { label: "Message" },
  "actor.displayName": { label: "Actor" },
  "actor.alternateId": { label: "Actor Email" },
  "client.ipAddress": { label: "Client IP" },
};

function getIocKey(ioc: Ioc): string {
  const rawIocKey = ioc?.threat?.indicator?.description;
  if (rawIocKey) {
    try {
      const url = new URL(rawIocKey);
      return url.hostname;
    } catch {
      return rawIocKey;
    }
  }
  return "";
}

export default SecurityLogDisplay;
