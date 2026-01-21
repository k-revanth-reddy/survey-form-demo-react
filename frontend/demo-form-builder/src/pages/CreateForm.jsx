import { useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import axios from "axios";

const CreateForm = () => {
  const [savedFormId, setSavedFormId] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const creator = new SurveyCreator({
    showLogicTab: true,
    isAutoSave: false
  });

  creator.saveSurveyFunc = async (saveNo, callback) => {
    try {
      const response = await axios.post("http://localhost:5000/forms", {
        schema: creator.JSON
      });
      
      setSavedFormId(response.data.formId);
      setShowLinkModal(true);
      callback(saveNo, true);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
      callback(saveNo, false);
    }
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}/form/${savedFormId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Form</h2>
      <SurveyCreatorComponent creator={creator} />

      {showLinkModal && savedFormId && (
        <div 
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            zIndex: 1000,
            minWidth: "500px"
          }}
        >
          <h3 style={{ marginTop: 0 }}>✅ Form Saved Successfully!</h3>
          <p>Share this link with people to fill the form:</p>
          
          <div style={{ marginTop: "15px", marginBottom: "20px" }}>
            <input 
              type="text" 
              readOnly 
              value={`${window.location.origin}/form/${savedFormId}`}
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={copyToClipboard}
              style={{ 
                flex: 1,
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Copy Link
            </button>
            <button 
              onClick={() => setShowLinkModal(false)}
              style={{ 
                flex: 1,
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showLinkModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999
          }}
          onClick={() => setShowLinkModal(false)}
        />
      )}
    </div>
  );
};

export default CreateForm;