import { api } from "../../utils/api.js";
import { useEffect, useState } from "react";
import SecurityLogArray from "./SecurityLogArray.jsx";

const IocTableRow = ({ ioc }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchIocData = async () => {
      try {
        let response = await api.post("/ioc-table", {
          ...ioc,
        });
        setData(response.data);
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchIocData();
  }, []);

  return (
    <tr>
      <td>
        <Button onClick={() => setShowModal(true)}>
          {ioc.threat.indicator.description}
        </Button>
        <Modal
          style={{
            width: "50%",
            marginLeft: "50%",
          }}
          runBackdropTransition={false}
          show={showModal}
          fullscreen={true}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{ioc.threat.indicator.description}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>lorem20</p>
          </Modal.Body>
        </Modal>
      </td>
      {/* {data.length ? <SecurityLogArray logs={data} /> : <td></td>} */}
    </tr>
  );
};

export default IocTableRow;
