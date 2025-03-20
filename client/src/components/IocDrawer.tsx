import {
  Button,
  Drawer,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { truncateString } from "../utils/helpers";
import PassiveDNSDrawer from "./PassiveDNS/PassiveDNSDrawer.tsx";
import { Ioc } from "../types.ts";
import NetFlowTable from "./Netflow/NetFlowTable.tsx";

type IocDrawerProps = {
  ioc: Ioc;
  closeDrawer: () => void;
  isOpen: boolean;
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
        // overlayProps={{ className: "bg-black/25 shadow-none" }}
        overlay={false}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Typography variant="h3" color="blue-gray" className="mb-0.5">
              {truncateString(ioc.threat.indicator.description)}
            </Typography>
            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
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
          <Typography variant="small" color="blue-gray" className="block">
            [{ioc.threat.indicator.type}]
          </Typography>
        </div>
        <Typography variant="h5" color="gray" className="mb-8 pr-4 font-normal">
          Security Logs
        </Typography>
        <Typography variant="h5" color="gray" className="mb-8 pr-4 font-normal">
          Netflow
        </Typography>
        <NetFlowTable ioc={ioc} />
        <PassiveDNSDrawer ioc={ioc} />
        <div className="flex gap-2">
          <Button size="sm" variant="outlined">
            Outlined Button
          </Button>
          <Button size="sm">Filled button</Button>
        </div>
      </Drawer>
    </>
  );
};

export default IocDrawer;
