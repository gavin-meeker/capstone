import Table from "react-bootstrap/Table";
import IocTableRow from "./IocTableRow.jsx";

const IocTable = ({ iocArray }) => {
  return (
    <>
      <Table striped bordered striped hover size="sm">
        <thead>
          <tr>
            <th>IOC</th>
            <th>Security Logs</th>
          </tr>
        </thead>
        <tbody>
          {iocArray.length > 0 &&
            iocArray.map((ioc) => (
              <IocTableRow key={crypto.randomUUID()} ioc={ioc} />
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default IocTable;
