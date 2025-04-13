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

  return (
    <tr className="relative cursor-pointer hover:bg-gray-50">
      {/* IOC Description Cell */}
      <td className="border-b border-gray-300 py-4 pl-4">
        <div className="flex gap-2">
          <CopyIcon textToCopy={ioc.threat.indicator.description} />
          <Typography onClick={handleIocClick} className="hover:underline">
            {truncateString(ioc.threat.indicator.description, 30)}
          </Typography>
        </div>
      </td>

      {/* ELK Link Cell */}
      <td className="border-b border-gray-300 py-4 pl-4">
        <a
          href="https://cloud.elastic.co/login"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          ELK
        </a>
      </td>
    </tr>
  );
};

export default IocTableRow;
