import { Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Ioc } from "../types.ts";
import IocDrawer from "./IocDrawer.js";
import IocTableRow from "./IocTableRow.js";

type IocTableProps = {
  iocArray: Ioc[];
};

const IocTable = ({ iocArray }: IocTableProps) => {
  const [ioc, setCurrentIoc] = useState<Ioc | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const tableHeaders = ["IOCs", "Security Logs", "PDNS Count", "Placholders"];

  return (
    <>
      <div className="mx-auto h-full w-5/6">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHeaders.map((headerName) => (
                <th className="border-b-4 border-green-400 !bg-black p-4">
                  <Typography
                    variant="small"
                    color="white"
                    className="font- py-4 text-left font-mono font-bold"
                  >
                    {headerName}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {iocArray.map((ioc) => (
              <IocTableRow
                key={ioc.threat.indicator.description}
                ioc={ioc}
                setCurrentIoc={setCurrentIoc}
                openDrawer={openDrawer}
              />
            ))}
          </tbody>
        </table>
        {ioc && <IocDrawer closeDrawer={closeDrawer} ioc={ioc} isOpen={open} />}
      </div>
    </>
  );
};

export default IocTable;
