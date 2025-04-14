import { Typography } from "@material-tailwind/react";
import { Ioc } from "../types.ts";
import { Dispatch, SetStateAction } from "react";
import { truncateString } from "../utils/helpers.ts";
import CopyIcon from "./svgs/CopyIcon.tsx";

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
        style={{ borderBottomColor: "grey", padding: "0.75rem" }}
      >
        <div className="flex gap-2">
          <CopyIcon textToCopy={ioc.threat.indicator.description} />
          <Typography
            onClick={handleIocClick}
            className="group-hover: text-shadow-[0_0_05px_rgba(0,0,0,0,8)]"
            style={{ color: "Teal", fontFamily: "monospace" }}
          >
            {truncateString(ioc.threat.indicator.description, 30)}
          </Typography>
        </div>
      </td>
    </tr>
  );
};

export default IocTableRow;
