import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Switch,
} from "@material-tailwind/react";
import { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { extractIocs } from "../App.tsx";
import { api } from "../utils/api";

type ExportCsvModalProps = {
  iocInput: string;
  handleOpen: () => void;
  open: boolean;
};
const ExportCsvModal = ({
  open,
  handleOpen,
  iocInput,
}: ExportCsvModalProps) => {
  //TODO: need to fix the multiple fetching that is occurring in this component
  const [shouldDefang, setShouldDefang] = useState(true);

  const { data, refetch } = useQuery({
    queryKey: ["iocs", iocInput, shouldDefang],
    queryFn: ({ queryKey }) => extractIocs(queryKey[1], queryKey[2]),
  });

  const {
    data: iocCsv,
    refetch: refetchIocCsv,
    isSuccess,
  } = useQuery({
    queryKey: ["iocToCsv", iocInput],
    queryFn: ({ queryKey }) => getIocCsv(queryKey[1]),
    enabled: false,
  });

  console.log(iocCsv);

  const handleDefangSwitch = async (e: ChangeEvent<HTMLInputElement>) => {
    setShouldDefang(e.target.checked);
    await refetch();
  };

  const handleIocCsv = async () => {
    refetchIocCsv();
  };

  if (isSuccess) {
    console.log(iocCsv.data);
    downloadCSV(iocCsv.data);
  }

  const displayableIocs = data?.data
    .filter(
      (ioc) =>
        ioc.threat.indicator.type == "ipv4-addr" ||
        ioc.threat.indicator.type == "ipv6-addr" ||
        ioc.threat.indicator.type == "domain",
    )
    .slice(0, 5);

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          Export to IOCs to CSV
          <div className="ml-auto">
            <Switch
              label="Defang?"
              checked={shouldDefang}
              onChange={(e) => handleDefangSwitch(e)}
            />
          </div>
        </DialogHeader>
        <DialogBody>
          <div>
            {displayableIocs &&
              displayableIocs.map((ioc) => (
                <div
                  className="text-center"
                  key={ioc.threat.indicator.description}
                >
                  {ioc.threat.indicator.description}
                </div>
              ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleIocCsv}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

const downloadCSV = (csvString: string) => {
  const csvData = new Blob([csvString], { type: "text/csv" });
  const csvURL = URL.createObjectURL(csvData);
  const link = document.createElement("a");
  link.href = csvURL;
  link.download = `test.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getIocCsv = async (iocInput: string) => {
  return api.post("/iocsToCsv", iocInput, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
export default ExportCsvModal;
