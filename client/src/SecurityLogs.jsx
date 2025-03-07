import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const SecurityLogs = () => {
  const pdnsInfo = [];
  const logs = [
    {
      "@timestamp": "2025-01-23T18:50:47.754Z",
      oil: "prisma",
      elk: "Log Aggregation",
      pdns: "DNS Monitoring",
      source: {
        ip: "1.2.3.4",
        port: "443",
        geo: {
          city_name: "Atlanta",
          country_iso_code: "US",
        },
      },
      destination: {
        ip: "8.8.8.8",
        port: "53",
      },
      event: {
        action: "allow",
      },
      rule: {
        name: "intrazone-default",
      },
    },
    {
      "@timestamp": "2025-01-23T21:12:52.566Z",
      oil: "elk",
      elk: "Security Analysis",
      pdns: "Threat Intelligence",
      source: {
        ip: "5.6.7.8",
        port: "1224",
        geo: {
          city_name: "New York",
          country_iso_code: "US",
        },
      },
      destination: {
        ip: "9.9.9.9",
        port: "443",
      },
      event: {
        action: "blocked",
      },
      rule: {
        name: "external-firewall",
      },
    },
    {
      "@timestamp": "2025-01-23T21:15:17.000Z",
      oil: "pdns",
      elk: "Security Visualization",
      pdns: "DNS Firewall",
      source: {
        ip: "10.0.0.1",
        port: "53015",
        geo: {
          city_name: "San Francisco",
          country_iso_code: "US",
        },
      },
      destination: {
        ip: "11.11.11.11",
        port: "25762",
      },
      event: {
        action: "alert",
      },
      rule: {
        name: "dns-security",
      },
    },
  ];

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Security Logs</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>
                {/* OIL Tooltip */}
                <span
                  data-tooltip-id={`tooltip-oil-${index}`}
                  data-tooltip-content={`
 OIL: ${log.oil}
 Timestamp: ${log["@timestamp"]}
 Location: ${log.source.geo.city_name}, ${log.source.geo.country_iso_code}
 Source Port: ${log.source.port || "N/A"}
 Destination Port: ${log.destination.port || "N/A"}
 Action: ${log.event.action || "Unknown"}
 Rule: ${log.rule.name || "N/A"}
                  `}
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  OIL
                </span>
                <Tooltip
                  id={`tooltip-oil-${index}`}
                  place="top"
                  effect="solid"
                  style={{
                    maxWidth: "400px",
                    whiteSpace: "pre-line",
                    padding: "10px",
                    fontSize: "14px",
                  }}
                />

                {/* ELK Tooltip */}
                <span
                  data-tooltip-id={`tooltip-elk-${index}`}
                  data-tooltip-content={`
ELK: ${log.elk}
Timestamp: ${log["@timestamp"]}
Location: ${log.source.geo.city_name}, ${log.source.geo.country_iso_code}
Source Port: ${log.source.port || "N/A"}
Destination Port: ${log.destination.port || "N/A"}
Action: ${log.event.action || "Unknown"}
                  `}
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  ELK
                </span>
                <Tooltip
                  id={`tooltip-elk-${index}`}
                  place="top"
                  effect="solid"
                  style={{
                    maxWidth: "400px",
                    whiteSpace: "pre-line",
                    padding: "10px",
                    fontSize: "14px",
                  }}
                />

                {/* PDNS Tooltip */}
                <span
                  data-tooltip-id={`tooltip-pdns-${index}`}
                  data-tooltip-content={`
PDNS: ${log.pdns}
Timestamp: ${log["@timestamp"]}
Location: ${log.source.geo.city_name}, ${log.source.geo.country_iso_code}
Source Port: ${log.source.port || "N/A"}
Destination Port: ${log.destination.port || "N/A"}
Action: ${log.event.action || "Unknown"}
                  `}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  PDNS
                </span>
                <Tooltip
                  id={`tooltip-pdns-${index}`}
                  place="top"
                  effect="solid"
                  style={{
                    maxWidth: "400px",
                    whiteSpace: "pre-line",
                    padding: "10px",
                    fontSize: "14px",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityLogs;
