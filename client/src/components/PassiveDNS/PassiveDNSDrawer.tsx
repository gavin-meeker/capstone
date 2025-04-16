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

  const [currentLookup, setCurrentLookup] = useState(
    ioc.threat.indicator.description,
  );

  const handleOpen = () => {
    setCurrentLookup(ioc.threat.indicator.description);
    setOpen(!open);
  };
  const { isPending, data, error } = useQuery({
    queryKey: ["passiveDnsCount", ioc.threat.indicator.description],
    queryFn: () => getPassiveDnsCount(ioc),
  });

  if (isPending) {
    return (
      <Spinner
        className="h-10 w-10"
        color="purple"
        style={{ fontFamily: "monospace", color: "#f0f0f0" }}
      />
    ); //Show Spinner while data is loading
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
          color="black"
          //TODO: need to conditionally add class names (hover state) based on if there are dns records
          style={{

            fontFamily: "monospace",
            color: "limegreen",
            cursor: "pointer",
            fontWeight: "normal",
            textAlign: "left",
            padding: "1rem",
          }}
          className="mt-8 cursor-pointer pr-4 font-mono font-normal hover:text-blue-400"
          onClick={handleOpen}
        >
          Passive DNS
          {hasDnsRecords && (
            <span>({data?.data[0].count.toLocaleString()} Records)</span>
          )}
        </Typography>

        <div className="flex items-center">
          <Typography
            variant="small"
            className="mr-2"
            style={{ color: "white", fontFamily: "monospace" }}
          >
            Summary
          </Typography>
          <Switch
            checked={useSummary}
            onChange={handleSummarySwitch}
            color="green"
          />
        </div>
      </div>
      {hasDnsRecords && (
        <PassiveDNSModal
          open={open}
          handleOpen={handleOpen}
          setCurrentLookup={setCurrentLookup}
          currentLookup={currentLookup}
          ioc={ioc}
        />
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
