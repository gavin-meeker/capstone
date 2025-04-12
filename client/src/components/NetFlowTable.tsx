import React, { useEffect, useState } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import { api } from "../../utils/api";
import { Ioc } from "../../types.ts";

type NetFlowTableProps = {
  ioc: Ioc;
};

type NetFlowData = {
  network: {
    transport: string;
  };
  source: {
    address: string;
    ip: string;
    port: string;
  };
  destination: {
    address: string;
    ip: string;
    port: string;
  };
  event: {
    start: string;
    end: string;
  };
  key: string;
  oil: string;
};

const NetFlowTable: React.FC<NetFlowTableProps> = ({ ioc }) => {
  const [netflowData, setNetflowData] = useState<NetFlowData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const iocKey = ioc?.threat?.indicator?.description;
  const isIpAddress = ioc?.threat?.indicator?.type === "ipv4-addr" || ioc?.threat?.indicator?.type === "ipv6-addr";

  useEffect(() => {
    const fetchNetflowData = async () => {
      if (!iocKey) return;
      
      setLoading(true);
      try {
        console.log("Fetching netflow data for:", iocKey);
        
        // We need to check both netflow and prisma oil types
        // First get all data for this IOC
        const response = await api.get(`/oil/${iocKey}`);
        const allData = response.data?.data || [];
        console.log("All data:", allData.length);
        
        // Filter for netflow records where the IOC is either source or destination
        const flowData = allData
          .filter((item: any) => 
            // Include both netflow and prisma records (similar formats)
            item.oil === "netflow" || item.oil === "prisma"
          )
          .filter((item: any) => 
            // The IOC can be in source.ip, destination.ip, or key
            item.source?.ip === iocKey || 
            item.destination?.ip === iocKey || 
            item.key === iocKey
          );
        
        console.log("Netflow records:", flowData.length);
        setNetflowData(flowData);
      } catch (error) {
        console.error("Error fetching netflow data:", error);
        setNetflowData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNetflowData();
  }, [iocKey]);

  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (netflowData.length === 0) {
    return (
      <Typography className="my-4 text-gray-600 italic">
        No NetFlow data found for {iocKey}.
      </Typography>
    );
  }

  return (
    <div className="mb-8">
      <Typography variant="h5" className="mb-4">
        Netflow
      </Typography>
      
      <table className="w-full text-sm table-auto mb-6">
        <tbody>
          {netflowData.map((flow, index) => {
            // Check if source or destination matches the IOC
            const srcMatches = flow.source?.ip === iocKey;
            const destMatches = flow.destination?.ip === iocKey;
            
            // Format timestamp
            const timestamp = flow.event?.start || "";
            
            // Sometimes one of the IPs might be undefined, handle that case
            const sourceIp = flow.source?.ip || "—";
            const sourcePort = flow.source?.port || "—";
            const destIp = flow.destination?.ip || "—";
            const destPort = flow.destination?.port || "—";
            const transport = flow.network?.transport || "—";
            
            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2">{timestamp}</td>
                <td className={`p-2 ${srcMatches ? "text-red-500 font-medium" : ""}`}>
                  {sourceIp}
                </td>
                <td className="p-2">{sourcePort}</td>
                <td className="p-2 text-center">→</td>
                <td className={`p-2 ${destMatches ? "text-red-500 font-medium" : ""}`}>
                  {destIp}
                </td>
                <td className="p-2">{destPort}</td>
                <td className="p-2">{transport}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NetFlowTable;