import { Typography } from "@material-tailwind/react";

const IocTableRow = ({ ioc, setCurrentIoc, openDrawer }) => {
  const handleIocClick = () => {
    setCurrentIoc(ioc);
    openDrawer();
  };
  return (
    <tr
      onClick={handleIocClick}
      className="relative cursor-pointer hover:bg-gray-50"
    >
      <td className="border-b border-gray-300 py-4 pl-4">
        <Typography>{ioc.threat.indicator.description}</Typography>
      </td>
    </tr>
  );
};

export default IocTableRow;
