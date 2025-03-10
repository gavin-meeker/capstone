import { api } from "../../utils/api.js";
import { useEffect, useState } from "react";
import SecurityLogArray from "./SecurityLogArray.jsx";

const IocTableRow = ({ ioc }) => {
  const [data, setData] = useState([]);

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
      <td>{ioc.threat.indicator.description}</td>
      {/* {data.length ? <SecurityLogArray logs={data} /> : <td></td>} */}
    </tr>
  );
};

export default IocTableRow;
