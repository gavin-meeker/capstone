import { Switch, Typography, Spinner } from "@material-tailwind/react";
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
  const [useSummary, setUseSummary] = useState<boolean>(true); // Add Switch State for DNS

  const handleOpen = () => setOpen(!open);
  const { isPending, data, error } = useQuery({
    queryKey: ["passiveDnsCount", ioc.threat.indicator.description, useSummary], // Add Switch to query key
    queryFn: () => getPassiveDnsCount(ioc, useSummary),
  });

  const handleSummarySwitch = () => {
    setUseSummary(!useSummary);
  };

  if (isPending) {
    return <Spinner className="h-10 w-10" />; //Show Spinner while data is loading
  }

  if (error) {
    return <Typography color="red">Error Loading Data.</Typography>; //Added Error message
  }

  const hasDnsRecords = !isPending && (data?.data?.length ?? 0) > 0;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Typography
          variant="h5"
          color="gray"
          //TODO: need to conditionally add class names (hover state) based on if there are dns records
          className="mb-8 cursor-pointer pr-4 font-normal hover:text-blue-400"
          onClick={handleOpen}
        >
          Passive DNS
          {hasDnsRecords &&
            ` (${data?.data[0].count.toLocaleString()} Records)`}
        </Typography>
        <div className="flex items-center">
          <Typography variant="small" className="mr-2">
            Summary
          </Typography>
          <Switch
            checked={useSummary}
            onChange={handleSummarySwitch}
            color="blue"
          />
        </div>
      </div>
      {hasDnsRecords && (
        <PassiveDNSModal
          ioc={ioc}
          open={open}
          handleOpen={handleOpen}
          useSummary={useSummary}
        /> // Pass useSummary down to the modal
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

const getPassiveDnsCount = async (ioc: Ioc, useSummary: boolean) => {
  const summaryEndpoint = `thecount/pdns/${ioc.threat.indicator.description}/_summary`;
  const fullEndpoint = `thecount/pdns/${ioc.threat.indicator.description}`;

  const endpoint = useSummary ? summaryEndpoint : fullEndpoint;
  return await api.post<PassiveDnsSummaryResult>(endpoint);
};

export default PassiveDNSDrawer;
