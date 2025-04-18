import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { truncateString } from "../utils/helpers";
import PassiveDNSDrawer from "./PassiveDNS/PassiveDNSDrawer.tsx";
import { Ioc } from "../types.ts";
import SecurityLogDisplay from "./SecurityLogDisplay.tsx";
import NetFlowTable from "./NetFlowTable.tsx";
import CopyIcon from "./svgs/CopyIcon.tsx";
import { ExternalTools } from "./ExternalTools.tsx";

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
          fontFamily: "monospace",
        }}
        className="max-h-screen overflow-y-auto border-l-8 border-[#B1B102] p-4"
        overlay={false}
      >
        <div
          className="mb-6"
          style={{ borderBottom: "1px solid #222", paddingBottom: "1rem" }}
        >
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2"
              style={{ fontFamily: "monospace" }}
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

          {ioc.threat.indicator.type === "ipv4-addr" ||
          ioc.threat.indicator.type === "ipv6-addr" ? (
            <ExternalTools threat={ioc.threat} />
          ) : (
            <p className="mt-2 text-sm italic text-white">
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
          className="mb-14 pr-4 font-normal text-green-400"
          style={{
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
        <div style={{ color: "#66BB67", fontFamily: "monospace" }}></div>
        <PassiveDNSDrawer ioc={ioc} />
      </Drawer>
    </>
  );
};

export default IocDrawer;
