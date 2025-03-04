import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

const testData = `# IPs
1.2.3.4
4.5.6[.]7
2607:f8b0:400c:c05::65

# Domains
domain1.com
domain2[.]xyz
www.domain3[.]biz

# URLs
hxxps://www.domain3[.]org/bad/stuff

# Hashes
F88ADB10AB5313D4FA33416F6F5FB4FF
3B26493A5BADBA73D08DE156E13F5FD16D56B750585182605E81744247D2C5BD

# Usernames
This user is corp\\test
a1ServiceAccount
p1PamAccount
c00024 b29509
This is an English sentence, and none of these words should be mistaken for usernames.`;
function App() {
  // TODO: need to remove this testData
  const [iocInput, setIocInput] = useState(testData);
  const [iocArray, setIocArray] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const handleClick = async () => {
    if (!iocInput) return;
    try {
      const data = await fetch("http://localhost:8080/v1/extract", {
        method: "POST",
        body: iocInput,
        "Content-Type": "text/plain",
      });
      const iocData = await data.json();
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
      <div className="textbox">
        <h1 className="blue-500">Hello</h1>
        <Form.Control
          placeholder="Paste/Enter IOC Data Here"
          as="textarea"
          style={{ height: "100px", width: "50%" }}
          onChange={(e) => setIocInput(e.target.value)}
        />
        <Button onClick={handleClick} className="bg-indigo">
          Extract IOC
        </Button>
      </div>
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
}

export default App;
