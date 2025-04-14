import { Switch, Typography, Spinner } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { Ioc } from "../../types";
import PassiveDNSModal from "./PassiveDNSModal";
import { useState } from "react";

type PassiveDNSDrawerProps = {
  ioc: Ioc;
};

const PassiveDNSDrawer = ({ ioc }: PassiveDNSDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [useSummary, setUseSummary] = useState<boolean>(true);

  const handleOpen = () => setOpen(!open);
  
  // Use the ioc description and summary state in the query key
  const { isPending, data, error } = useQuery({
    queryKey: ["passiveDnsCount", ioc.threat.indicator.description, useSummary],
    queryFn: () => getPassiveDnsCount(ioc, useSummary),
    // Don't refetch on window focus for passive data
    refetchOnWindowFocus: false,
    // Increase stale time since this data doesn't change often
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSummarySwitch = () => {
    setUseSummary(!useSummary);
  };

  if (isPending) {
    return (
      <div className="flex justify-center my-4">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="red" className="my-4">
        Error loading DNS data: {error instanceof Error ? error.message : "Unknown error"}
      </Typography>
    );
  }

  // Check if we have DNS records to display
  const hasDnsRecords = !isPending && (data?.length ?? 0) > 0;
  const recordCount = hasDnsRecords ? data?.[0]?.count : 0;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Typography
          variant="h5"
          color="gray"
          className={`mb-8 pr-4 font-normal ${
            hasDnsRecords ? "cursor-pointer hover:text-blue-400" : "opacity-50"
          }`}
          onClick={hasDnsRecords ? handleOpen : undefined}
        >
          Passive DNS
          {hasDnsRecords && ` (${recordCount.toLocaleString()} Records)`}
        </Typography>
        
        <div className="flex items-center">
          <Typography variant="small" className="mr-2">
            Summary
          </Typography>
          <Switch
            checked={useSummary}
            onChange={handleSummarySwitch}
            color="blue"
            disabled={!hasDnsRecords}
          />
        </div>
      </div>
      
      {!hasDnsRecords && (
        <Typography color="gray" className="italic text-sm mb-4">
          No DNS records found for this indicator.
        </Typography>
      )}
      
      {hasDnsRecords && (
        <PassiveDNSModal
          ioc={ioc}
          open={open}
          handleOpen={handleOpen}
          useSummary={useSummary}
        />
      )}
    </>
  );
};

type PassiveDnsSummary = {
  host: {
    ip?: string[];
    name?: string[];
  };
  count: number;
  num_results?: number;
  event: {
    start: string;
    end: string;
  };
};

/**
 * Fetches passive DNS count data for an IOC
 */
const getPassiveDnsCount = async (ioc: Ioc, useSummary: boolean) => {
  const iocValue = ioc.threat.indicator.description;
  const endpoint = useSummary 
    ? `thecount/pdns/${iocValue}/_summary`
    : `thecount/pdns/${iocValue}`;
  
  try {
    const response = await api.post(endpoint);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching passive DNS data:", error);
    return [];
  }
};

export default PassiveDNSDrawer;