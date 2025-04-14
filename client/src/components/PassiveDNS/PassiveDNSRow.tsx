import { Typography, Tooltip } from "@material-tailwind/react";
import { PassiveDnsRecord } from "./PassiveDNSModal";

type PassiveDNSRowProps = {
  record: PassiveDnsRecord;
  onPivot: (newIoc: string) => void;
};

const PassiveDNSRow = ({
  record,
  onPivot
}: PassiveDNSRowProps) => {
  // Extract field values
  const { type, data, name, event, count } = record;
  
  // Format dates
  const startDate = formatDate(event.start);
  const endDate = formatDate(event.end);
  
  // Determine if this is clickable for pivot
  const isPivotable = type === 'A' || type === 'AAAA' || type === 'CNAME' || type === 'NS';
  
  const handleClick = () => {
    if (isPivotable) {
      // For A/AAAA records, pivot to the IP address (data)
      // For CNAME/NS records, pivot to the hostname (data)
      onPivot(data);
    }
  };
  
  return (
    <tr className={`hover:bg-gray-50 ${isPivotable ? 'cursor-pointer' : ''}`}>
      <td className="border-b border-gray-300 py-4 pl-4" onClick={handleClick}>
        <Typography className={isPivotable ? "text-blue-600 hover:underline" : ""}>
          {name}
        </Typography>
      </td>
      <td className="border-b border-gray-300 py-4 pl-4" onClick={handleClick}>
        <Typography className={isPivotable ? "text-blue-600 hover:underline" : ""}>
          {data}
        </Typography>
        {isPivotable && (
          <Tooltip content="Click to pivot to this indicator">
            <span className="ml-2 text-xs text-blue-600">
              (Click to pivot)
            </span>
          </Tooltip>
        )}
      </td>
      <td className="border-b border-gray-300 py-4 pl-4">
        <Typography>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
            {type}
          </span>
          {count > 1 && (
            <span className="ml-2 text-xs text-gray-500">
              ({count.toLocaleString()} occurrences)
            </span>
          )}
        </Typography>
      </td>
      <td className="border-b border-gray-300 py-4 pl-4">
        <Typography>{startDate}</Typography>
      </td>
      <td className="border-b border-gray-300 py-4 pl-4">
        <Typography>{endDate}</Typography>
      </td>
    </tr>
  );
};

// Format date for better display
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

export default PassiveDNSRow;