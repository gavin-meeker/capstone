import { Card, Typography } from "@material-tailwind/react";
import IocTableRow from "./IocTableRow.jsx";

const IocTable = ({ iocArray }) => {
  return (
    <>
      <div className="h-full mx-auto w-5/6 overflow-scroll">
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
              <tr
                key={ioc.threat.indicator.description}
                className="hover:bg-gray-50"
              >
                <td className="pl-4 py-4 border-b border-gray-300">
                  <Typography>{ioc.threat.indicator.description}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default IocTable;
