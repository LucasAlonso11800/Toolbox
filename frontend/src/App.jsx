import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState("");

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
        <Navbar className="bg-danger mb-4">
          <Navbar.Brand className="mx-3 text-white">
            React Test App
          </Navbar.Brand>
        </Navbar>
        <main>
          <Container>
            <Spinner
              animation="border"
              variant="primary"
              className="d-block mx-auto"
            />
          </Container>
        </main>
      </>
    );

  return (
    <>
      <Navbar className="bg-danger mb-4">
        <Navbar.Brand className="ms-3 text-white">React Test App</Navbar.Brand>
      </Navbar>
      <main>
        <Container>
          <Form
            className="mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              getFiles(fileName);
            }}
          >
            <Form.Group className="mb-2">
              <Form.Label>Search a specific file</Form.Label>
              <Row >
                <Form.Control
                  type="text"
                  placeholder="File name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="d-inline w-auto"
                />
                <Button variant="primary" type="submit" className="ms-2 w-auto">
                  Search
                </Button>
              </Row>
            </Form.Group>
          </Form>
          <Table striped bordered hover>
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
