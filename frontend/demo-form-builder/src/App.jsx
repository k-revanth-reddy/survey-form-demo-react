import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateForm from "./pages/CreateForm";
import MyForms from "./pages/MyForms";
import PublicForm from "./pages/PublicForm";
import Responses from "./pages/Responses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyForms />} />
        <Route path="/create" element={<CreateForm />} />
        <Route path="/form/:id" element={<PublicForm />} />
        <Route path="/responses/:id" element={<Responses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
