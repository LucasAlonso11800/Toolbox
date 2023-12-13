import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFiles = useCallback(async (fileName = "") => {
    try {
      setLoading(true);
      const response = (
        await axios.get(`http://localhost:5000/files/data/${fileName}`)
      ).data;
      setFiles(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getFiles();
  }, [getFiles]);

  if (loading)
    return (
      <>
        <header></header>
        <main>
          <Container>
            <Spinner animation="border" variant="primary" className="d-block mx-auto mt-4"/>
          </Container>
        </main>
      </>
    );

  return (
    <>
      <header></header>
      <main>
        <Container>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Text</th>
                <th>Number</th>
                <th>Hex</th>
              </tr>
            </thead>
            <tbody>
              {files.map(({ lines }) =>
                lines.map((line) => (
                  <tr>
                    <td>{line.file}</td>
                    <td>{line.text}</td>
                    <td>{line.number}</td>
                    <td>{line.hex}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Container>
      </main>
    </>
  );
}
