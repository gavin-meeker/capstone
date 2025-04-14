import { Tooltip, Typography, Chip } from "@material-tailwind/react";
import { Ioc, ThreatLevel } from "../types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { truncateString } from "../utils/helpers";
import { IocAnalyzer } from "../utils/iocAnalyzer";

type IocTableRowProps = {
  ioc: Ioc;
  setCurrentIoc: Dispatch<SetStateAction<Ioc | undefined>>;
  openDrawer: () => void;
};

// Map threat levels to colors and icons
const THREAT_LEVEL_CONFIG: Record<ThreatLevel, { color: string, bgColor: string }> = {
  "HIGH": { color: "red", bgColor: "bg-red-500" },
  "MEDIUM": { color: "amber", bgColor: "bg-amber-500" },
  "LOW": { color: "green", bgColor: "bg-green-500" },
  "UNKNOWN": { color: "gray", bgColor: "bg-gray-500" }
};

const IocTableRow = ({ ioc, setCurrentIoc, openDrawer }: IocTableRowProps) => {
  const [analyzedIoc, setAnalyzedIoc] = useState<Ioc>(ioc);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Analyze the IOC when the component mounts
  useEffect(() => {
    const analyzeIoc = async () => {
      try {
        setIsAnalyzing(true);
        const enhanced = await IocAnalyzer.analyzeIoc(ioc);
        setAnalyzedIoc(enhanced);
      } catch (error) {
        console.error("Error analyzing IOC:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    
    analyzeIoc();
  }, [ioc]);
  
  const handleIocClick = () => {
    setCurrentIoc(analyzedIoc);
    openDrawer();
  };
  
  // Determine threat level display
  const threatLevel = analyzedIoc.context?.threatLevel || "UNKNOWN";
  const { color, bgColor } = THREAT_LEVEL_CONFIG[threatLevel];
  
  // Determine IOC type display
  const iocType = ioc.threat.indicator.type;
  const iocTypeDisplay = getIocTypeDisplay(iocType);
  
  return (
    <tr className="relative cursor-pointer hover:bg-gray-50">
      <td className="border-b border-gray-300 py-4 pl-4">
        <div className="flex items-center gap-3">
          {/* Threat level indicator */}
          <div className={`h-3 w-3 rounded-full ${bgColor}`} title={`${threatLevel} Risk`}></div>
          
          {/* Copy button */}
          <Tooltip content="Copy IOC">
            <button 
              className="p-1 rounded hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(ioc.threat.indicator.description);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
            </button>
          </Tooltip>
          
          {/* IOC value */}
          <div onClick={handleIocClick} className="flex-1">
            <div className="flex items-center gap-2">
              <Typography className="font-medium">
                {truncateString(ioc.threat.indicator.description, 30)}
              </Typography>
              
              {/* IOC type badge */}
              <Chip
                size="sm"
                variant="ghost"
                value={iocTypeDisplay}
                color="blue-gray"
                className="text-xs"
              />
            </div>
            
            {/* Context summary if available */}
            {analyzedIoc.context && (
              <Typography variant="small" color="gray" className="text-xs mt-1">
                {isAnalyzing 
                  ? "Analyzing..." 
                  : truncateString(analyzedIoc.context.description, 50)}
              </Typography>
            )}
          </div>
          
          {/* Security log indicator, if any */}
          {analyzedIoc.context?.securityLogCount > 0 && (
            <Tooltip content={`Found in ${analyzedIoc.context.securityLogCount} security logs`}>
              <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {analyzedIoc.context.securityLogCount}
              </div>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
};

/**
 * Get a user-friendly display name for an IOC type
 */
const getIocTypeDisplay = (iocType: string): string => {
  const typeMap: Record<string, string> = {
    "ipv4-addr": "IPv4",
    "ipv6-addr": "IPv6",
    "domain-name": "Domain",
    "url": "URL",
    "file": "File Hash",
    "email-addr": "Email",
    "user-account": "User"
  };
  
  return typeMap[iocType] || iocType;
};

export default IocTableRow;