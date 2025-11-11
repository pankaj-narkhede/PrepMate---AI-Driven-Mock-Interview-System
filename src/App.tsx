import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "@/layouts/public-layout";
import HomePage from "@/Routes/HomePage";
import AuthLayout from "@/layouts/auth-layout";
import SignUpPage from "./Routes/SignUp";
import Signin from "@/Routes/Signin";
import ProtectedRoutes from "./layouts/ProtectedRoutes";
import MainLayout from "./layouts/mainLayout";
import Generate from "./components/generate";
import { Dashboard } from "./Routes/dashboard";
import { CreateEditPage } from "./Routes/createEditPage";
import { MockLoadPage } from "./Routes/mockLoadPage";
import { MockInterviewPage } from "./Routes/mockInterviewPage";
import { Feedback } from "./Routes/feedbacks";


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/signin/*" element={<Signin />} />
            <Route path="/signup/*" element={<SignUpPage />} />
          </Route>

          {/* protected routes */}
          <Route
            element={
              <ProtectedRoutes>
                <MainLayout />
              </ProtectedRoutes>
            }
          ></Route>
          {/* add all protected  routes */}
          <Route element={<Generate />} path="/generate">
            <Route index element={<Dashboard />} />
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route path="interview/:interviewId/start" element={<MockInterviewPage
             />} />
             <Route path="feedBack/:interviewId" element={<Feedback/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
