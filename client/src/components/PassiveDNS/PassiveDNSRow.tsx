import { PassiveDnsRecord } from "./PassiveDNSModal.tsx";
import { Typography } from "@material-tailwind/react";

type PassiveDNSRowProps = {
  record: PassiveDnsRecord;
  setCurrentLookup: (value: string | ((prevState: string) => string)) => void;
  currentLookup: string | undefined;
};

const PassiveDnsRow = ({
  record: { type, data, name, event },
  setCurrentLookup,
  currentLookup,
}: PassiveDNSRowProps) => {
  return (
    <tr className="relative hover:bg-gray-50">
      <td className={`border-b border-gray-300 py-4 pl-4`}>
        <Typography
          className={currentLookup !== name ? "cursor-pointer underline" : ""}
          onClick={() => setCurrentLookup(name)}
        >
          {name}
        </Typography>
      </td>
      <td className={`border-b border-gray-300 py-4 pl-4`}>
        <Typography
          className={currentLookup !== data ? "cursor-pointer underline" : ""}
          onClick={() => setCurrentLookup(data)}
        >
          {data}
        </Typography>
      </td>
      <td className="border-b border-gray-300 py-4 pl-4">
        <Typography>{type}</Typography>
      </td>
      {/*TODO: adjust rendering of dates to be prettier*/}
      <td className="border-b border-gray-300 py-4 pl-4">
        <Typography>{event.start}</Typography>
      </td>
      <td className="border-b border-gray-300 py-4 pl-4">
        <Typography>{event.end}</Typography>
      </td>
    </tr>
  );
};

export default PassiveDnsRow;
