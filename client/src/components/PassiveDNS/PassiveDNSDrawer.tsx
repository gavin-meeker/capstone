import { Typography, Spinner } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api.js";
import { Ioc } from "../../types.ts";
import PassiveDNSModal from "./PassiveDNSModal.tsx";
import { useState } from "react";

type PassiveDNSDrawerProps = {
  ioc: Ioc;
};

const PassiveDNSDrawer = ({ ioc }: PassiveDNSDrawerProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(!open);
  const { isPending, data, isError, error } = useQuery<{
    data: PassiveDnsSummaryResult;
  }>({
    queryKey: ["passiveDnsCount", ioc.threat.indicator.description],
    queryFn: () => getPassiveDnsCount(ioc),
  });

  // Used Null Coalescing to extend the ways in which data verification is handled
  const hasDnsRecords = !isPending && (data?.data?.length ?? 0) > 0;
  return (
    <>
      <Typography
        variant="h5"
        color="gray"
        // Added a conditonally triggered parameter
        className={`mb-8 cursor-pointer pr-4 font-normal ${
          hasDnsRecords ? "hover:text-blue-400" : ""
        }`}
        onClick={handleOpen}
      >
        Passive DNS
        {hasDnsRecords && ` (${data?.data[0]?.count.toLocaleString()} Records)`}
      </Typography>
      {isPending && (
        <div className="flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      )}
      {isError && (
        <Typography color="red">
          Error loading Passive DNS:{" "}
          {Error instanceof Error
            ? error?.message
            : "An unknown error has occured."}
        </Typography>
      )}
      {hasDnsRecords && (
        <PassiveDNSModal ioc={ioc} open={open} handleOpen={handleOpen} />
      )}
    </>
  );
};

type PassiveDnsSummary = {
  host: {
    ip: string[];
  };
  count: number;
  num_results: number;
  event: {
    start: string;
    end: string;
  };
};

type PassiveDnsSummaryResult = PassiveDnsSummary[];

const getPassiveDnsCount = async (
  ioc: Ioc,
): Promise<{ data: PassiveDnsSummaryResult }> => {
  return await api.post<PassiveDnsSummaryResult>(
    `thecount/pdns/${ioc.threat.indicator.description}/_summary`,
  );
};

export default PassiveDNSDrawer;
