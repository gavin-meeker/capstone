import { Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api.js";
import { Ioc } from "../types.ts";

type PassiveDNSDrawerProps = {
  ioc: Ioc;
};

const PassiveDNSDrawer = ({ ioc }: PassiveDNSDrawerProps) => {
  const { isPending, data } = useQuery({
    queryKey: ["passiveDns", ioc.threat.indicator.description],
    queryFn: () => getPassiveDnsCount(ioc),
  });
  //TODO: would like a better way to handle the loading state to show a spinner or something
  const hasDnsRecords = !isPending && data?.data.length > 0;
  return (
    <>
      <Typography variant="h5" color="gray" className="mb-8 pr-4 font-normal">
        Passive DNS
        {hasDnsRecords && ` (${data?.data[0].count.toLocaleString()} Records)`}
      </Typography>
    </>
  );
};

const getPassiveDnsCount = async (ioc: Ioc) => {
  return await api.post<any>(
    `thecount/pdns/${ioc.threat.indicator.description}/_summary`,
  );
};

export default PassiveDNSDrawer;
