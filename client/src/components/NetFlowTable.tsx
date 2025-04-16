import React, { useEffect, useState } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import { api } from "../utils/api";
import { Ioc } from "../types";

type NetFlowTableProps = {
  ioc: Ioc;
};

// Define the NetFlow data structure
type NetFlowData = {
  network: {
    transport: string;
  };
  source: {
    address?: string;
    ip: string;
    port: string;
  };
  destination: {
    address?: string;
    ip: string;
    port: string;
  };
  event: {
    start: string;
  };
};

const NetFlowTable: React.FC<NetFlowTableProps> = ({ ioc }) => {
  const [netflowData, setNetflowData] = useState<NetFlowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iocKey = ioc?.threat?.indicator?.description;

  useEffect(() => {
    const fetchNetflowData = async () => {
      if (!iocKey) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch all logs related to this IOC
        const response = await api.post(`/thecount/oil/${iocKey}`);
        const allData = response.data || [];

        // Filter for netflow records only
        const flowData = allData.filter(
          (item: any) =>
            // Only include netflow and related traffic records
            item.oil === "netflow" ||
            (item.oil === "prisma" && item.network?.transport),
        );

        console.log(`Found ${flowData.length} netflow records for ${iocKey}`);
        setNetflowData(flowData);
      } catch (error) {
        console.error("Error fetching netflow data:", error);
        setError("Failed to load network flow data.");
        setNetflowData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNetflowData();
  }, [iocKey]);

  if (loading) {
    return (
      <div className="my-2 flex justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return <Typography className="my-2 text-red-600">{error}</Typography>;
  }

  if (netflowData.length === 0) {
    return (
      <Typography
        className="my-2 italic text-gray-700"
        style={{
          color: "limegreen",
          fontFamily: "monospace",
          padding: ".75rem",
        }}
      >
        No network flow data found for {iocKey}.
      </Typography>
    );
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="border-b border-gray-300 px-3 py-2 text-left font-medium text-gray-800"
                style={{ color: "limegreen", backgroundColor: "#1e1e1e" }}
              >
                Timestamp
              </th>
              <th
                className="border-b border-gray-300 px-3 py-2 text-left font-medium text-gray-800"
                style={{ color: "limegreen", backgroundColor: "#1e1e1e" }}
              >
                Source
              </th>
              <th
                className="border-b border-gray-300 px-3 py-2 text-left font-medium text-gray-800"
                style={{ color: "limegreen", backgroundColor: "#1e1e1e" }}
              >
                Port
              </th>
              <th
                className="border-b border-gray-300 px-3 py-2 text-center font-medium text-gray-800"
                style={{ color: "limegreen", backgroundColor: "#1e1e1e" }}
              >
                →
              </th>
              <th
                className="border-b border-gray-300 px-3 py-2 text-left font-medium text-gray-800"
                style={{ color: "limegreen", backgroundColor: "#1e1e1e" }}
              >
                Destination
              </th>
              <th
                className="border-b border-gray-300 px-3 py-2 text-left font-medium text-gray-800"
                style={{ color: "limegreen", backgroundColor: "#1e1e1e" }}
              >
                Port
              </th>
              <th
                className="border-b border-gray-300 px-3 py-2 text-left font-medium text-gray-800"
                style={{ color: "limegreen", backgroundColor: "#1e1e1e" }}
              >
                Protocol
              </th>
            </tr>
          </thead>
          <tbody
            className="text-gray-700"
            style={{ color: "limegreen", fontFamily: "monospace" }}
          >
            {netflowData.map((flow, index) => {
              // Format timestamp
              const timestamp = formatDate(flow.event?.start || "");

              // Check if source or destination matches the IOC
              const srcMatches = flow.source?.ip === iocKey;
              const destMatches = flow.destination?.ip === iocKey;

              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                  style={{ textAlign: "left", padding: "1rem" }}
                >
                  <td className="px-3 py-1">{timestamp}</td>
                  <td
                    className={`px-3 py-1 ${srcMatches ? "font-medium text-red-600" : ""}`}
                  >
                    {flow.source?.ip || "—"}
                  </td>
                  <td className="px-3 py-1">{flow.source?.port || "—"}</td>
                  <td className="px-3 py-1 text-center">→</td>
                  <td
                    className={`px-3 py-1 ${destMatches ? "font-medium text-red-600" : ""}`}
                  >
                    {flow.destination?.ip || "—"}
                  </td>
                  <td className="px-3 py-1">{flow.destination?.port || "—"}</td>
                  <td className="px-3 py-1">
                    {flow.network?.transport?.toUpperCase() || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Format date for better display
const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toISOString().replace("T", " ").substring(0, 19) + "Z";
  } catch (e) {
    return dateString;
  }
};

export default NetFlowTable;
