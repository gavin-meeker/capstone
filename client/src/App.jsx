import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { api } from "../utils/api";
import IocTable from "./components/IocTable.jsx";

function App() {
  // TODO: need to remove this testData
  const [iocInput, setIocInput] = useState("");
  const [iocArray, setIocArray] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const handleClick = async () => {
    if (!iocInput) return;

    try {
      const { data: iocData } = await api.post("/extract", iocInput, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      setIocArray(iocData);
    } catch (e) {
      setFetchError(e);
    }
  };

  // TODO: better error resolution here
  if (fetchError) {
    return <div>Could not fetch to get IOCs. Please refresh and try again</div>;
  }

  return (
    <>
      <Container>
        <Form.Control
          placeholder="Paste/Enter IOC Data Here"
          as="textarea"
          style={{ height: "100px", width: "50%" }}
          onChange={(e) => setIocInput(e.target.value)}
        />
        <Button onClick={handleClick}>Extract IOC</Button>
      </Container>
      <IocTable iocArray={iocArray} />
    </>
  );
}

export default App;
