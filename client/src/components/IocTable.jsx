import { Typography } from "@material-tailwind/react";
import { useState } from "react";
import IocDrawer from "./IocDrawer.jsx";
import IocTableRow from "./IocTableRow.jsx";

const IocTable = ({ iocArray }) => {
  const [currentIoc, setCurrentIoc] = useState(undefined);

  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <>
      <div className="mx-auto h-full w-5/6">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-gray-100 bg-gray-200 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none"
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
        <IocDrawer
          closeDrawer={closeDrawer}
          currentIoc={currentIoc}
          isOpen={open}
        />
      </div>
    </>
  );
};

export default IocTable;
