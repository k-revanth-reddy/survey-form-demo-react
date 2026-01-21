import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import "survey-core/survey-core.min.css";
import axios from "axios";

const PublicForm = () => {
  const { id } = useParams();
  const [surveyModel, setSurveyModel] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/forms/${id}`)
      .then(res => {
        const survey = new Model(res.data);

        survey.onComplete.add(sender => {
          axios.post(
            `http://localhost:5000/forms/${id}/responses`,
            sender.data
          );
        });

        setSurveyModel(survey);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!surveyModel) return <p>Loading form...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Survey model={surveyModel} />
    </div>
  );
};

export default PublicForm;