import { api } from "../utils/api";
import { Ioc } from "../types.ts";
import { useQuery } from "@tanstack/react-query";

type SecurityLogDisplayProps = {
  ioc: Ioc;
};

const SECURITY_SOURCES = ["azure", "okta", "prisma", "helios", "email"];

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
      .map((log: any) => ({
        timestamp: log.timestamp || log["@timestamp"] || "—",
        key: iocKey, // ✅ Override key to show searched IOC
        oil: log.oil || "—",
      }));

  if (!iocKey) return <p>⚠️ No IOC key provided.</p>;
  if (isPending) return <p>Loading logs...</p>;

  return (
    <div>
      <h3>
        Security Logs for IOC: <code>{iocKey}</code>
      </h3>
      {filteredLogs.length === 0 ? (
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
            {filteredLogs.map((log) => (
              <tr key={log.key}>
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
