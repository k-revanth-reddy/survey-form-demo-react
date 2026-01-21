import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import axios from "axios";

const CreateForm = () => {
  const creator = new SurveyCreator({
    showLogicTab: true,
    isAutoSave: false
  });

  creator.saveSurveyFunc = async (saveNo, callback) => {
    try {
      await axios.post("http://localhost:5000/forms", {
        schema: creator.JSON
      });
      alert("Form saved successfully");
      callback(saveNo, true);
    } catch (err) {
      console.error(err);
      callback(saveNo, false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Form</h2>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
};

export default CreateForm;