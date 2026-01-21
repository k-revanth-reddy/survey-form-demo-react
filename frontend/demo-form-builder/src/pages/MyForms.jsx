import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/forms")
      .then(res => setForms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Forms</h2>

      <Link to="/create">
        <button>Create New Form</button>
      </Link>

      <hr />

      {forms.length === 0 && <p>No forms created yet.</p>}

      {forms.map(form => (
        <div key={form.id} style={{ marginBottom: "15px" }}>
          <p><strong>Form ID:</strong> {form.id}</p>

          <Link to={`/form/${form.id}`}>
            <button>Open Form</button>
          </Link>

          <Link to={`/responses/${form.id}`} style={{ marginLeft: "10px" }}>
            <button>View Responses</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MyForms;
