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
import CopyIcon from "./svgs/CopyIcon.tsx";

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
              <CopyIcon textToCopy={ioc.threat.indicator.description} />
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
          {ioc.threat.indicator.type === "ipv4-addr" ||
          ioc.threat.indicator.type === "ipv6-addr" ? (
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-blue-600 underline">
              <a
                target="_blank"
                href={`https://www.shodan.io/search?query=${ioc.threat.indicator.description}`}
              >
                Shodan
              </a>
              <a
                target="_blank"
                href={`https://search.censys.io/hosts/${ioc.threat.indicator.description}`}
              >
                Censys
              </a>
              <a
                target="_blank"
                href={`https://spur.us/context/${ioc.threat.indicator.description}`}
              >
                Spur
              </a>
              <a
                target="_blank"
                href={`https://bgpview.io/ip/${ioc.threat.indicator.description}`}
              >
                BGPView
              </a>
            </div>
          ) : (
            <p className="mt-2 text-sm italic text-gray-500">
              External tools only available for IP addresses.
            </p>
          )}
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
