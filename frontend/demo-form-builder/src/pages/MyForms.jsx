import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyForms = () => {
  const [forms, setForms] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/forms")
      .then(res => setForms(res.data))
      .catch(err => console.error(err));
  }, []);

  const copyToClipboard = (formId) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Forms</h2>

      <Link to="/create">
        <button style={{ padding: "10px 20px", marginBottom: "20px" }}>
          Create New Form
        </button>
      </Link>

      <hr />

      {forms.length === 0 && <p>No forms created yet.</p>}

      {forms.map(form => (
        <div 
          key={form.id} 
          style={{ 
            marginBottom: "20px", 
            padding: "15px", 
            border: "1px solid #ddd",
            borderRadius: "5px"
          }}
        >
          <p><strong>Form ID:</strong> {form.id}</p>
          
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Shareable Link:
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input 
                type="text" 
                readOnly 
                value={`${window.location.origin}/form/${form.id}`}
                style={{ 
                  flex: 1, 
                  padding: "8px", 
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  backgroundColor: "#f9f9f9"
                }}
              />
              <button 
                onClick={() => copyToClipboard(form.id)}
                style={{ 
                  padding: "8px 15px",
                  backgroundColor: copiedId === form.id ? "#28a745" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer"
                }}
              >
                {copiedId === form.id ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <Link to={`/form/${form.id}`}>
              <button style={{ marginRight: "10px", padding: "8px 15px" }}>
                Preview Form
              </button>
            </Link>

            <Link to={`/responses/${form.id}`}>
              <button style={{ padding: "8px 15px" }}>
                View Responses
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyForms;