import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

const SecurityLogArray = ({ logs }) => {
  return (
    <td>
      {Object.entries(logs).map(([key, value]) => {
        return (
          <Button
            key={crypto.randomUUID()}
            size="sm"
            variant="outline-secondary"
          >
            {key} <Badge>{value}</Badge>
          </Button>
        );
      })}
    </td>
  );
};

export default SecurityLogArray;
