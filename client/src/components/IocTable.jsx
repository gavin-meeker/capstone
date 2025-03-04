import Table from "react-bootstrap/Table";

const IocTable = ({ iocArray }) => {
  return (
    <>
      <Table striped bordered striped hover>
        <thead>
          <tr>
            <th>IOC</th>
          </tr>
        </thead>
        <tbody>
          {iocArray.length > 0 &&
            iocArray.map((ioc) => (
              <tr key={crypto.randomUUID()}>
                <td>{ioc.threat.indicator.description}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default IocTable;
