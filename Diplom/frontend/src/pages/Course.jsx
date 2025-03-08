import { useParams } from "react-router-dom";
import Materials from "../components/Materials";

function Course() {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>Детальная информация о курсе #{id}</h1>
      <Materials courseId={id} />
    </div>
  );
}

export default Course;
