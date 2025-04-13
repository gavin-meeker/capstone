import { Tooltip, Typography } from "@material-tailwind/react";
import { Ioc } from "../types.ts";
import { Dispatch, SetStateAction } from "react";
import { truncateString } from "../utils/helpers.ts";

type IocTableRowProps = {
  ioc: Ioc;
  setCurrentIoc: Dispatch<SetStateAction<Ioc | undefined>>;
  openDrawer: () => void;
};

const IocTableRow = ({ ioc, setCurrentIoc, openDrawer }: IocTableRowProps) => {
  const handleIocClick = () => {
    setCurrentIoc(ioc);
    openDrawer();
  };
  //ioc.threat.indicator.description -- ip address for domain, table row component and drawers use of prop
  return (
    <tr
      className="relative cursor-pointer hover:bg-gray-50"
      style={{ color: "limegreen", fontFamily: "monospace" }}
    >
      <td
        className="border-b border-gray-300 py-4 pl-4"
        style={{ borderBottomColor: "#333", padding: "0.75rem" }}
      >
        <div className="flex gap-2">
          <Tooltip content="Copy IOC">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-gray-400 hover:text-gray-600"
              style={{ color: "#a1a1aa" }}
              onClick={() =>
                navigator.clipboard.writeText(ioc.threat.indicator.description)
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              />
            </svg>
          </Tooltip>
          <Typography
            onClick={handleIocClick}
            style={{
              color: "#2dd4bf",
              fontFamily: "monospace",
              textDecoration: "underline",
            }}
          >
            {truncateString(ioc.threat.indicator.description, 30)}
          </Typography>
        </div>
      </td>
    </tr>
  );
};

export default IocTableRow;
