import { Typography } from "@material-tailwind/react";
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
  const { isPending, data } = useQuery({
    queryKey: ["passiveDnsCount", ioc.threat.indicator.description],
    queryFn: () => getPassiveDnsCount(ioc),
  });
  //TODO: would like a better way to handle the loading state to show a spinner or something
  const hasDnsRecords = !isPending && data?.data?.length > 0;
  return (
    <>
      <Typography
        variant="h5"
        color="gray"
        //TODO: need to conditionally add class names (hover state) based on if there are dns records
        className="mb-8 cursor-pointer pr-4 font-normal hover:text-blue-400"
        onClick={handleOpen}
      >
        Passive DNS
        {hasDnsRecords && ` (${data?.data[0].count.toLocaleString()} Records)`}
      </Typography>
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

const getPassiveDnsCount = async (ioc: Ioc) => {
  return await api.post<PassiveDnsSummaryResult>(
    `thecount/pdns/${ioc.threat.indicator.description}/_summary`,
  );
};

export default PassiveDNSDrawer;
