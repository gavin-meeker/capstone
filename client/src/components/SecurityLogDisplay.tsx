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

  const extractTooltipInfo = (log: any): string[] => {
    const lines: string[] = [];

    // Common fields
    if (log.email?.from?.address) lines.push(`From: ${log.email.from.address}`);
    if (log.email?.to?.address) lines.push(`To: ${log.email.to.address}`);
    if (log.email?.subject) lines.push(`Subject: ${log.email.subject}`);
    if (log.megaoil?.pipeline) lines.push(`Pipeline: ${log.megaoil.pipeline}`);
    if (log.event?.module) lines.push(`Module: ${log.event.module}`);
    if (log.event?.message) lines.push(`Event: ${log.event.message}`);
    if (log.userPrincipalName)
      lines.push(`Principal: ${log.userPrincipalName}`);
    if (log.userDisplayName) lines.push(`User: ${log.userDisplayName}`);
    if (log.coxAccountName) lines.push(`Cox Account: ${log.coxAccountName}`);
    if (log.displayName) lines.push(`Device: ${log.displayName}`);
    if (log.client?.ip) lines.push(`Client IP: ${log.client.ip}`);
    if (log.client?.asn) lines.push(`ASN: ${log.client.asn}`);
    if (log.Suricata?.Signature)
      lines.push(`Suricata Sig: ${log.Suricata.Signature}`);
    if (log.rule?.name) lines.push(`Rule: ${log.rule.name}`);

    // Okta-specific fields
    if (log.displayMessage) lines.push(`Message: ${log.displayMessage}`);
    if (log.actor?.displayName) lines.push(`Actor: ${log.actor.displayName}`);
    if (log.actor?.alternateId)
      lines.push(`Actor Email: ${log.actor.alternateId}`);
    if (log.client?.ipAddress) lines.push(`Client IP: ${log.client.ipAddress}`);
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
                      <div className="absolute left-0 top-full z-10 mt-1 hidden w-64 rounded border bg-white p-2 text-xs shadow-md group-hover:block">
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
