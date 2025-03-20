import { Ioc } from "../../types.ts";
import { Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
import PassiveDNSRow from "../PassiveDNS/PassiveDNSRow.tsx";

type NetFlowTableProps = {
  ioc: Ioc;
};
const NetFlowTable = ({ ioc }: NetFlowTableProps) => {
  const { isPending, data } = useQuery({
    queryKey: ["netflow", ioc.threat.indicator.description],
    queryFn: () => getnetflowData(ioc),
  });

  //TODO: would like a better way to handle the loading state to show a spinner or something
  const currentNetFlowData = data?.data || undefined;
  return (
    <>
      <table className="mb-6 w-full min-w-max table-auto text-left">
        <tbody>
          {currentNetFlowData &&
            currentNetFlowData.map((netflow) => {
              return (
                <tr key={netflow.key + netflow.event.start}>
                  <td>
                    <Typography>{netflow.event.start}</Typography>
                  </td>
                  <td>
                    <Typography>{netflow.source.ip}</Typography>
                  </td>
                  <td>
                    <Typography>{netflow.source.port}</Typography>
                  </td>
                  <td>
                    <Typography>→</Typography>
                  </td>
                  <td>
                    <Typography>{netflow.destination.ip}</Typography>
                  </td>
                  <td>
                    <Typography>{netflow.destination.port}</Typography>
                  </td>
                  <td>
                    <Typography>{netflow.network.transport}</Typography>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

type NetFlowData = {
  network: {
    transport: string;
  };
  source: {
    address: string;
    ip: string;
    port: string;
  };
  destination: {
    address: string;
    ip: string;
    port: string;
  };
  event: {
    start: string;
    end: string;
  };
  key: string;
  oil: string;
};

type NetFlowDataResult = NetFlowData[];

const getnetflowData = async (ioc: Ioc) => {
  return await api.post<NetFlowDataResult>(
    `thecount/oil/netflow/${ioc.threat.indicator.description}`,
  );
};

export default NetFlowTable;
