import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Switch,
} from "@material-tailwind/react";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { extractIocs } from "../App.tsx";
import { api } from "../utils/api";
import type { Ioc } from "../types";

type ExportCsvModalProps = {
  iocInput: string;
  open: boolean;
  handleOpen: () => void;
};

type IocCsvResponse = {
  fileName: string;
  csv: string;
};

const CSV_PREVIEW_LIMIT = 5;

const ExportCsvModal = ({ open, handleOpen, iocInput }: ExportCsvModalProps) => {
  const [shouldDefang, setShouldDefang] = useState(true);
  
  const { data: iocs, isLoading } = useQuery({
    queryKey: ["iocs", iocInput, shouldDefang],
    queryFn: () => extractIocs(iocInput, shouldDefang),
    enabled: open,
    select: (response) => response.data.filter((ioc: Ioc) => 
      ["ipv4-addr", "ipv6-addr", "domain"].includes(ioc.threat.indicator.type)
    )
  });

  // Memoized preview data
  const previewIocs = iocs?.slice(0, CSV_PREVIEW_LIMIT) || [];

  const handleDownload = useCallback(async () => {
    try {
      const { data } = await api.post<IocCsvResponse>(
        "/iocsToCsv",
        { 
          iocs: iocs,
          defang: shouldDefang 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const blob = new Blob([data.csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("CSV download failed:", error);
    }
  }, [iocs, shouldDefang]);

  return (
    <Dialog open={open} handler={handleOpen} size="sm">
      <DialogHeader>
        Export IOCs to CSV
        <div className="ml-auto">
          <Switch
            label="Defang?"
            checked={shouldDefang}
            onChange={(e) => setShouldDefang(e.target.checked)}
            crossOrigin="anonymous"
          />
        </div>
      </DialogHeader>
      
      <DialogBody>
        {isLoading ? (
          <div className="text-center">Processing IOCs...</div>
        ) : previewIocs.length === 0 ? (
          <div className="text-center text-gray-500">
            No exportable IOCs found
          </div>
        ) : (
          <div className="space-y-2">
            {previewIocs.map((ioc) => (
              <div 
                key={`${ioc.key}-${ioc.threat.indicator.type}`}
                className="text-center font-mono truncate"
              >
                {ioc.threat.indicator.description}
              </div>
            ))}
            {iocs.length > CSV_PREVIEW_LIMIT && (
              <div className="text-center text-gray-500 text-sm">
                + {iocs.length - CSV_PREVIEW_LIMIT} more IOCs...
              </div>
            )}
          </div>
        )}
      </DialogBody>

      <DialogFooter>
        <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
          Cancel
        </Button>
        <Button 
          variant="gradient" 
          color="green" 
          onClick={handleDownload}
          disabled={!iocs?.length}
        >
          Download CSV
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ExportCsvModal;
