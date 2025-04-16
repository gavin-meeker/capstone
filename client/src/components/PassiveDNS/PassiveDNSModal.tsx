import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { api } from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { truncateString } from "../../utils/helpers.ts";
import PassiveDNSRow from "./PassiveDNSRow.tsx";
import { Ioc } from "../../types.ts";

type PassiveDNSModalProps = {
  open: boolean;
  handleOpen: () => void;
  setCurrentLookup: (value: ((prevState: string) => string) | string) => void;
  currentLookup: string;
  ioc: Ioc;
};

const PassiveDNSModal = ({
  open,
  handleOpen,
  setCurrentLookup,
  currentLookup,
  ioc,
}: PassiveDNSModalProps) => {
  //TODO: need to implement pivoting for when a user clicks on a on dns record and it swaps the search
  //TODO: need to fix rendering twice

  const { data } = useQuery({
    queryKey: ["passiveDnsItems", currentLookup],
    queryFn: ({ queryKey }) => getPassiveDnsRecords(queryKey[1]),
  });

  const currentDns = data?.data || undefined;
  const tableHeaders = ["Name", "Address", "Type", "First Seen", "Last Seen"];

  return (
    <>
      <Dialog open={open} handler={handleOpen} size={"lg"}>
        <DialogHeader className="text-orange-500">
          DNS Records for: {truncateString(currentLookup)}
        </DialogHeader>
        <DialogBody
          className="h-[42rem] overflow-scroll"
          style={{ color: "yellow" }}
        >
          <Typography variant={"small"} className="block">
            Original Lookup:
            <span
              className="cursor-pointer font-bold text-blue-500 underline"
              onClick={() =>
                setCurrentLookup(ioc?.threat.indicator.description)
              }
            >
              {`${ioc?.threat.indicator.description}`}
            </span>
          </Typography>
          <table
            className="w-full min-w-max table-auto text-left"
            style={{ color: "teal" }}
          >
            <thead>
              <tr>
                {tableHeaders.map((header) => {
                  return (
                    <th
                      key={header}
                      className="border-b border-gray-100 bg-gray-200 p-4"
                      style={{ color: "orange" }}
                    >
                      <Typography
                        variant="small"
                        color="green"
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
                    return (
                      <PassiveDNSRow
                        record={record}
                        setCurrentLookup={setCurrentLookup}
                        currentLookup={currentLookup}
                      />
                    );
                  }),
                )}
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            cancel
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
