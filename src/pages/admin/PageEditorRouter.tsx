import { useParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import HomeEditor from "./HomeEditor";
import AboutEditor from "./AboutEditor";
import StudentLifeEditor from "./StudentLifeEditor";
import ContactEditor from "./ContactEditor";
import AcademicsEditor from "./AcademicsEditor";
import AdmissionsEditor from "./AdmissionsEditor";

const PageEditorRouter = () => {
  const { page } = useParams();

  if (page === "home") {
    return <HomeEditor />;
  }

  if (page === "about") {
    return <AboutEditor />;
  }

  if (page === "academics") {
    return <AcademicsEditor />;
  }

  if (page === "admissions") {
    return <AdmissionsEditor />;
  }

  if (page === "student-life") {
    return <StudentLifeEditor />;
  }

  if (page === "contact") {
    return <ContactEditor />;
  }

  return <Dashboard />;
};

export default PageEditorRouter;
