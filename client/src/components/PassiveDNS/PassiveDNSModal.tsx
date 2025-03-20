import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { api } from "../../utils/api";
import { Ioc } from "../../types.ts";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { truncateString } from "../../utils/helpers.ts";
import PassiveDNSRow from "./PassiveDNSRow.tsx";

type PassiveDNSModalProps = {
  ioc: Ioc;
  open: boolean;
  handleOpen: () => void;
};

const PassiveDNSModal = ({ open, handleOpen, ioc }: PassiveDNSModalProps) => {
  //TODO: need to implement pivoting for when a user clicks on a on dns record and it swaps the search
  //TODO: need to fix rendering twice
  const [currentLookup, setCurrentLookup] = useState(
    ioc.threat.indicator.description,
  );

  const { data } = useQuery({
    queryKey: ["passiveDnsItems", ioc.threat.indicator.description],
    queryFn: () => getPassiveDnsRecords(currentLookup),
  });

  const currentDns = data?.data || undefined;
  const tableHeaders = ["Name", "Address", "Type", "First Seen", "Last Seen"];

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          DNS Records for: {truncateString(currentLookup)}
        </DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {tableHeaders.map((header) => {
                  return (
                    <th
                      key={header}
                      className="border-b border-gray-100 bg-gray-200 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none"
                      >
                        {header}
                      </Typography>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currentDns &&
                currentDns.map(({ dns }) =>
                  dns.answers.map((record) => {
                    return <PassiveDNSRow record={record} />;
                  }),
                )}
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export type PassiveDnsRecord = {
  data: string;
  name: string;
  type: string;
  count: number;
  event: {
    start: string;
    end: string;
  };
};

type PassiveDnsRecordsResponse = {
  dns: {
    answers: PassiveDnsRecord[];
  };
}[];

const getPassiveDnsRecords = async (ioc: string) => {
  return await api.post<PassiveDnsRecordsResponse>(`thecount/pdns/${ioc}`);
};

export default PassiveDNSModal;
