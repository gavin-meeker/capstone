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

  return (
    <>
      <div className="mx-auto h-full w-5/6">
        <table
          className="w-full min-w-max table-auto text-left"
          style={{
            color: "limegreen",
            fontFamily: "monospace",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                className="border-b border-gray-100 bg-gray-200 p-4"
                style={{
                  backgroundColor: "black",
                  borderBottom: "1px solid limegreen",
                  padding: "0.75rem",
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none"
                  style={{
                    backgroundColor: "black",
                    borderBottom: "1px solid limegreen",
                    padding: "0.75rem",
                    textAlign: "left",
                  }}
                >
                  IOC
                </Typography>
              </th>
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
