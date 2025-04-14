import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { api } from "../../utils/api";
import { Ioc } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { truncateString } from "../../utils/helpers";
import PassiveDNSRow from "./PassiveDNSRow";

type PassiveDNSModalProps = {
  ioc: Ioc;
  open: boolean;
  handleOpen: () => void;
  useSummary: boolean;
};

const PassiveDNSModal = ({ 
  open, 
  handleOpen, 
  ioc, 
  useSummary 
}: PassiveDNSModalProps) => {
  // Track the currently displayed IOC (for pivoting)
  const [currentLookup, setCurrentLookup] = useState<string>(
    ioc.threat.indicator.description
  );

  // Fetch the DNS records
  const { data, isLoading, error } = useQuery({
    queryKey: ["passiveDnsRecords", currentLookup, useSummary],
    queryFn: () => getPassiveDnsRecords(currentLookup, useSummary),
    enabled: open, // Only fetch when the modal is open
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle pivoting to a different IOC
  const handlePivot = (newIoc: string) => {
    if (newIoc !== currentLookup) {
      setCurrentLookup(newIoc);
    }
  };

  // Table headers differ based on summary mode
  const tableHeaders = useSummary
    ? ["Record Count", "First Seen", "Last Seen"]
    : ["Name", "Address", "Type", "First Seen", "Last Seen"];

  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader className="flex items-center justify-between">
        <div>
          DNS Records for: {truncateString(currentLookup, 40)}
        </div>
        <div className="text-sm font-normal text-gray-600">
          {useSummary ? "Summary View" : "Detailed View"}
        </div>
      </DialogHeader>
      
      <DialogBody className="h-[42rem] overflow-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-12 w-12" />
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center p-4">
            Error loading DNS records: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}
        
        {!isLoading && !error && data && data.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            No DNS records found for {currentLookup}
          </div>
        )}
        
        {!isLoading && !error && data && data.length > 0 && (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header} className="border-b border-gray-100 bg-gray-200 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-bold leading-none"
                    >
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {useSummary ? (
                // Summary view rendering
                data.map((summary, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border-b border-gray-300 py-4 pl-4">
                      <Typography>{summary.count.toLocaleString()}</Typography>
                    </td>
                    <td className="border-b border-gray-300 py-4 pl-4">
                      <Typography>{formatDate(summary.event.start)}</Typography>
                    </td>
                    <td className="border-b border-gray-300 py-4 pl-4">
                      <Typography>{formatDate(summary.event.end)}</Typography>
                    </td>
                  </tr>
                ))
              ) : (
                // Detailed view rendering
                data.flatMap((item, itemIndex) => 
                  item.dns?.answers.map((record, recordIndex) => (
                    <PassiveDNSRow 
                      key={`${itemIndex}-${recordIndex}`} 
                      record={record} 
                      onPivot={handlePivot}
                    />
                  )) || []
                )
              )}
            </tbody>
          </table>
        )}
      </DialogBody>
      
      <DialogFooter className="space-x-2">
        <Button variant="outlined" color="blue-gray" onClick={handleOpen}>
          Close
        </Button>
        {currentLookup !== ioc.threat.indicator.description && (
          <Button 
            variant="text" 
            color="blue" 
            onClick={() => setCurrentLookup(ioc.threat.indicator.description)}
          >
            Reset to Original
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};

// Format date for better display
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

// Types for the DNS records
export type PassiveDnsRecord = {
  data: string;
  name: string;
  type: string;
  count: number;
  event: {
    start: string;
    end: string;
  };
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

type PassiveDnsRecordsResponse = {
  dns: {
    answers: PassiveDnsRecord[];
  };
}[];

/**
 * Fetch DNS records from the API
 */
const getPassiveDnsRecords = async (ioc: string, useSummary: boolean) => {
  try {
    const endpoint = useSummary 
      ? `thecount/pdns/${ioc}/_summary`
      : `thecount/pdns/${ioc}`;
    
    const response = await api.post(endpoint);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching passive DNS records:", error);
    throw error;
  }
};

export default PassiveDNSModal;