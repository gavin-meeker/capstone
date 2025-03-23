import { Typography, Chip, Tooltip } from "@material-tailwind/react";
import { Ioc, ThreatLevel, IocContext } from "../types.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { analyzeIocContext } from "../utils/ioc-context-analyzer";

type IocTableRowProps = {
  ioc: Ioc;
  setCurrentIoc: Dispatch<SetStateAction<Ioc | undefined>>;
  openDrawer: () => void;
};

// Define threat levels and their corresponding colors
const THREAT_LEVELS = {
  HIGH: "red",
  MEDIUM: "amber",
  LOW: "green",
  UNKNOWN: "gray",
};

const IocTableRow = ({ ioc, setCurrentIoc, openDrawer }: IocTableRowProps) => {
  const [iocContext, setIocContext] = useState<IocContext>({
    threatLevel: "UNKNOWN" as ThreatLevel,
    direction: "default",
    description: "Analyzing...",
    securityLogCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleIocClick = () => {
    setCurrentIoc(ioc);
    openDrawer();
  };

  useEffect(() => {
    const loadIocContext = async () => {
      try {
        setIsLoading(true);

        // Get context analysis for this IOC
        const context = await analyzeIocContext(ioc);

        // Update the state with the analyzed context
        setIocContext(context);

        // Update the IOC object with the context for future reference
        ioc.context = context;

        setIsLoading(false);
      } catch (error) {
        console.error("Error analyzing IOC context:", error);
        setIsLoading(false);
      }
    };

    loadIocContext();
  }, [ioc]);

  return (
    <tr
      onClick={handleIocClick}
      className={`relative cursor-pointer transition-colors ${
        isLoading ? "opacity-70" : ""
      } hover:bg-gray-50`}
    >
      <td className="border-b border-gray-300 py-4 pl-4">
        <div className="flex items-center">
          {/* Threat level indicator */}
          <div
            className={`mr-3 h-4 w-4 rounded-full bg-${THREAT_LEVELS[iocContext.threatLevel]}-500`}
            title={`Threat Level: ${iocContext.threatLevel}`}
          ></div>

          {/* IOC Description */}
          <Typography className="flex-grow">
            {ioc.threat.indicator.description}
          </Typography>

          <div className="ml-4 flex items-center space-x-2">
            {/* IOC Type */}
            <Tooltip content={`Type: ${ioc.threat.indicator.type}`}>
              <Chip
                size="sm"
                variant="outlined"
                value={ioc.threat.indicator.type}
                className="capitalize"
              />
            </Tooltip>

            {/* Context Tag */}
            <Tooltip content={iocContext.description}>
              <Chip
                size="sm"
                color={THREAT_LEVELS[iocContext.threatLevel].toLowerCase()}
                value={
                  iocContext.direction !== "default"
                    ? iocContext.direction
                    : "context"
                }
              />
            </Tooltip>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default IocTableRow;
