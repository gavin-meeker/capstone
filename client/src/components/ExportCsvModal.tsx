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

  const handleDefangSwitch = async (e: ChangeEvent<HTMLInputElement>) => {
    setShouldDefang(e.target.checked);
    await refetch();
  };

  const handleIocCsv = async () => {
    const iocCsvData = await getIocCsv(iocInput, shouldDefang);
    downloadCSV(iocCsvData.data.fileName, iocCsvData.data.csv);
  };

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
      <Dialog open={open} handler={handleOpen} size="sm">
        <DialogHeader style={{ color: "yellow" }}>
          Export to IOCs to CSV
          <div className="ml-auto" style={{ color: "white" }}>
            <Switch
              label="Defang?"
              checked={shouldDefang}
              onChange={(e) => handleDefangSwitch(e)}
              color="green"
            />
          </div>
        </DialogHeader>
        <DialogBody style={{ color: "white" }}>
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
            variant="gradient"
            color="black"
            style={{
              color: "red",
              fontFamily: "monospace",
              textDecorationColor: "black",
            }}
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            onClick={handleIocCsv}
            style={{
              color: "limegreen",
              fontFamily: "monospace",
              textDecorationColor: "black",
            }}
          >
            <span>Download CSV</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

const downloadCSV = (fileName: string, csvString: string) => {
  const csvData = new Blob([csvString], { type: "text/csv" });
  const csvURL = URL.createObjectURL(csvData);
  const link = document.createElement("a");
  link.href = csvURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

type IocCsvResponse = {
  fileName: string;
  csv: string;
};

const getIocCsv = async (iocInput: string, shouldDefang = true) => {
  return api.post<IocCsvResponse>(
    `/iocsToCsv${shouldDefang ? "?defang=true" : ""}`,
    iocInput,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
};
export default ExportCsvModal;
