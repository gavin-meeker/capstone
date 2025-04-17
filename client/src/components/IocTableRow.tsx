import { Typography } from "@material-tailwind/react";
import { Ioc } from "../types.ts";
import { Dispatch, SetStateAction } from "react";
import { truncateString } from "../utils/helpers.ts";
import CopyIcon from "./svgs/CopyIcon.tsx";
import { api } from "../utils/api";
import { PassiveDnsSummaryResult } from "./PassiveDNS/PassiveDNSDrawer.tsx";
import { useQuery } from "@tanstack/react-query";

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

  const { isPending, data, error } = useQuery({
    queryKey: ["passiveDnsCount", ioc.threat.indicator.description],
    queryFn: () => getPassiveDnsCount(ioc),
  });

  const hasDnsRecords = !isPending && (data?.data?.length ?? 0) > 0;

  return (
    <tr className="relative cursor-pointer text-green-400 hover:bg-gray-50">
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
      <td
        className="border-b border-gray-300 py-4 pl-4"
        style={{ borderBottomColor: "grey", padding: "0.75rem" }}
      >
        <Typography
          onClick={handleIocClick}
          className="group-hover: text-shadow-[0_0_05px_rgba(0,0,0,0,8)]"
          style={{ color: "Teal", fontFamily: "monospace" }}
        >
          {hasDnsRecords && <span>{data?.data[0].count.toLocaleString()}</span>}
        </Typography>
      </td>

      {/* ELK Link Cell */}
      <td
        className="border-b border-gray-300 py-4 pl-4"
        style={{ borderBottomColor: "grey" }}
      >
        <a
          href="https://cloud.elastic.co/login"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          style={{ color: "teal" }}
        >
          ELK
        </a>
      </td>
    </tr>
  );
};

export const getPassiveDnsCount = async (ioc: Ioc) => {
  return await api.post<PassiveDnsSummaryResult>(
    `thecount/pdns/${ioc.threat.indicator.description}/_summary`,
  );
};
export default IocTableRow;
