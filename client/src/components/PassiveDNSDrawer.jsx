import { Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";

const PassiveDNSDrawer = ({ ioc }) => {
  const { isPending, data } = useQuery({
    queryKey: ["passiveDns", ioc.threat.indicator.description],
    queryFn: () => getPassiveDnsCount(ioc.threat.indicator.description),
  });
  //TODO: would like a better way to handle the loading state to show a spinner or something
  const hasDnsRecords = !isPending && data?.data.length > 0;
  return (
    <>
      <Typography variant="h5" color="gray" className="mb-8 pr-4 font-normal">
        Passive DNS
        {hasDnsRecords && ` (${data.data[0].count.toLocaleString()} Records)`}
      </Typography>
    </>
  );
};

const getPassiveDnsCount = async (iocInput) => {
  return await api.post(`thecount/pdns/${iocInput}/_summary`);
  // return await api.post(`thecount/pdns/1.2.3.4/_summary`);
};

export default PassiveDNSDrawer;
