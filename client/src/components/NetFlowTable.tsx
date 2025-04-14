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
        const flowData = allData.filter((item: any) => 
          // Only include netflow and related traffic records
          item.oil === "netflow" || 
          (item.oil === "prisma" && item.network?.transport)
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
      <div className="flex justify-center my-2">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Typography className="my-2 text-red-600">
        {error}
      </Typography>
    );
  }

  if (netflowData.length === 0) {
    return (
      <Typography className="my-2 text-gray-700 italic">
        No network flow data found for {iocKey}.
      </Typography>
    );
  }

  return (
    <div className="mt-6 mb-6">
      <Typography variant="h5" className="mb-2 text-gray-900 font-medium">
        Netflow Data for IOC: {iocKey}
      </Typography>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border-b border-gray-300 text-left text-gray-800 font-medium">Timestamp</th>
              <th className="py-2 px-3 border-b border-gray-300 text-left text-gray-800 font-medium">Source</th>
              <th className="py-2 px-3 border-b border-gray-300 text-left text-gray-800 font-medium">Port</th>
              <th className="py-2 px-3 border-b border-gray-300 text-center text-gray-800 font-medium">→</th>
              <th className="py-2 px-3 border-b border-gray-300 text-left text-gray-800 font-medium">Destination</th>
              <th className="py-2 px-3 border-b border-gray-300 text-left text-gray-800 font-medium">Port</th>
              <th className="py-2 px-3 border-b border-gray-300 text-left text-gray-800 font-medium">Protocol</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {netflowData.map((flow, index) => {
              // Format timestamp
              const timestamp = formatDate(flow.event?.start || "");
              
              // Check if source or destination matches the IOC
              const srcMatches = flow.source?.ip === iocKey;
              const destMatches = flow.destination?.ip === iocKey;
              
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-1 px-3">{timestamp}</td>
                  <td className={`py-1 px-3 ${srcMatches ? "text-red-600 font-medium" : ""}`}>
                    {flow.source?.ip || "—"}
                  </td>
                  <td className="py-1 px-3">{flow.source?.port || "—"}</td>
                  <td className="py-1 px-3 text-center">→</td>
                  <td className={`py-1 px-3 ${destMatches ? "text-red-600 font-medium" : ""}`}>
                    {flow.destination?.ip || "—"}
                  </td>
                  <td className="py-1 px-3">{flow.destination?.port || "—"}</td>
                  <td className="py-1 px-3">{flow.network?.transport?.toUpperCase() || "—"}</td>
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
    return date.toISOString().replace('T', ' ').substring(0, 19) + 'Z';
  } catch (e) {
    return dateString;
  }
};

export default NetFlowTable;