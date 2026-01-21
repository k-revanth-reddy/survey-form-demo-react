import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Responses = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/forms/${id}/responses`)
      .then(res => setResponses(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Responses</h2>

      {responses.length === 0 && <p>No responses yet.</p>}

      <pre style={{ background: "#f5f5f5", padding: "10px" }}>
        {JSON.stringify(responses, null, 2)}
      </pre>
    </div>
  );
};

export default Responses;
