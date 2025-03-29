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
import { api } from "../utils/api";
import { extractIocs } from "../App.tsx";

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
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
export default ExportCsvModal;
