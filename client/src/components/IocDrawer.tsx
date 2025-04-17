import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { truncateString } from "../utils/helpers";
import PassiveDNSDrawer from "./PassiveDNS/PassiveDNSDrawer.tsx";
import { Ioc } from "../types.ts";
import SecurityLogDisplay from "./SecurityLogDisplay.tsx";
import NetFlowTable from "./NetFlowTable.tsx";
import CopyIcon from "./svgs/CopyIcon.tsx";

type IocDrawerProps = {
  ioc: Ioc;
  closeDrawer: () => void;
  isOpen: boolean;
};

const IocDrawer = ({ closeDrawer, ioc, isOpen }: IocDrawerProps) => {
  return (
    <>
      <Drawer
        placement={"right"}
        size={800}
        open={isOpen}
        onClose={closeDrawer}
        style={{
          backgroundColor: "#333333",
          color: "limegreen",
          fontFamily: "monospace",
          borderLeft: "1px solid #222",
        }}
        // overlayProps={{ className: "bg-black/25 shadow-none" }}
        className="max-h-screen overflow-y-auto p-4"
        overlay={true}
      >
        <div
          className="mb-6"
          style={{ borderBottom: "1px solid #222", paddingBottom: "1rem" }}
        >
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2"
              style={{ color: "limegreen", fontFamily: "monospace" }}
            >
              <CopyIcon textToCopy={ioc.threat.indicator.description} />
              <Typography
                variant="h3"
                color="blue-gray"
                style={{ color: "orange", fontFamily: "monospace" }}
              >
                {truncateString(ioc.threat.indicator.description)}
              </Typography>
            </div>
            <IconButton variant="text" color="black" onClick={closeDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
                style={{ color: "#a1a1aa", fontFamily: "monospace" }}
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
            style={{ color: "yellow", fontFamily: "monospace" }}
          >
            [{ioc.threat.indicator.type}]
          </Typography>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-blue-600 underline">
            <a
              target="_blank"
              href={`https://www.shodan.io/search?query=${ioc.threat.indicator.description}`}
              style={{ textDecoration: "underline", fontFamily: "monospace" }}
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

          <p className="mt-2 text-sm italic text-white">
            External tools only available for IP addresses.
          </p>
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
          style={{
            color: "limegreen",
            fontFamily: "monospace",
            textAlign: "left",
            textIndent: ".75rem",
            textSizeAdjust: "1rem",
            position: "relative",
            top: "40px",
          }}
        >
          Netflow
        </Typography>
        <NetFlowTable ioc={ioc} />
        <div style={{ color: "limegreen", fontFamily: "monospace" }}></div>
        <PassiveDNSDrawer ioc={ioc} />
      </Drawer>
    </>
  );
};

export default IocDrawer;
