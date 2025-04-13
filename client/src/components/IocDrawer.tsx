import {
  Button,
  Drawer,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { truncateString } from "../utils/helpers";
import PassiveDNSDrawer from "./PassiveDNS/PassiveDNSDrawer.tsx";
import { Ioc } from "../types.ts";
import SecurityLogDisplay from "./SecurityLogDisplay.tsx";
import NetFlowTable from "./Netflow/NetFlowTable.tsx";

type IocDrawerProps = {
  ioc: Ioc;
  closeDrawer: () => void;
  isOpen: boolean;
};

type OilData = {
  oil: string;
  [key: string]: any; // for other fields you're not directly using
};

type OilResponse = {
  data: OilData[];
};
const IocDrawer = ({ closeDrawer, ioc, isOpen }: IocDrawerProps) => {
  return (
    <>
      {/* TODO: would be cool to find a way to fix the background for drawer when scrolling */}
      <Drawer
        placement={"right"}
        size={800}
        open={isOpen}
        onClose={closeDrawer}
        className="p-4"
        style={{
          backgroundColor: "black",
          color: "limegreen",
          fontFamily: "monospace",
        }}
        // overlayProps={{ className: "bg-black/25 shadow-none" }}
        overlay={false}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 text-gray-400 hover:cursor-pointer"
                style={{ color: "#a1a1aa" }}
                onClick={() =>
                  navigator.clipboard.writeText(
                    ioc.threat.indicator.description,
                  )
                }
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
              <Typography
                variant="h3"
                color="blue-gray"
                style={{ color: "#2dd4bf", fontFamily: "monospace" }}
              >
                {truncateString(ioc.threat.indicator.description)}
              </Typography>
            </div>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={closeDrawer}
              style={{ color: "#a1a1aa" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <Typography
            variant="small"
            color="blue-gray"
            className="block"
            style={{ color: "#a1a1aa", fontFamily: "monospace" }}
          >
            [{ioc.threat.indicator.type}]
          </Typography>
        </div>
        <Typography
          variant="h5"
          color="gray"
          className="mb-8 pr-4 font-normal"
          style={{ color: "gray", fontFamily: "monospace" }}
        >
          <SecurityLogDisplay ioc={ioc} />
        </Typography>
        <Typography
          variant="h5"
          color="gray"
          className="mb-8 pr-4 font-normal"
          style={{ color: "gray", fontFamily: "monospace" }}
        >
          Netflow
        </Typography>
        <NetFlowTable ioc={ioc} />
        <PassiveDNSDrawer ioc={ioc} />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outlined"
            style={{
              color: "limegreen",
              borderColor: "limegreen",
              fontFamily: "monospace",
            }}
          >
            Outlined Button
          </Button>
          <Button
            size="sm"
            style={{
              backgroundColor: "limegreen",
              color: "black",
              fontFamily: "monospace",
            }}
          >
            Filled button
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default IocDrawer;
