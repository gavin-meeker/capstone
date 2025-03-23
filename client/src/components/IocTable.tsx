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

  // Group IOCs by threat level
  const groupedIocs = iocArray.reduce((acc, ioc) => {
    // This is just a placeholder - the actual grouping will be done
    // dynamically by the IocTableRow component since it determines the threat level
    return {
      ...acc,
      [ioc.threat.indicator.type]: [
        ...(acc[ioc.threat.indicator.type] || []),
        ioc,
      ],
    };
  }, {});

  return (
    <>
      <div className="mx-auto h-full w-5/6">
        <div className="mb-4 flex items-center">
          <Typography variant="h5" color="blue-gray" className="flex-grow">
            Indicators of Compromise
          </Typography>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
              <span>Low Risk</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-gray-500"></div>
              <span>Unknown</span>
            </div>
          </div>
        </div>

        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-gray-100 bg-gray-200 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none"
                >
                  Indicator of Compromise
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
