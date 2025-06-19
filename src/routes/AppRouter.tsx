import { createBrowserRouter } from "react-router-dom";
import StudentDashboard from "../pages/Home";
import NewStudentForm from "../pages/NewStudent";
import { AppLayout } from "../layout/layout";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";
import { UserRole } from "../enums/UserRole";
import Corte1 from "../pages/Corte1";
import Corte2 from "../pages/Corte2";
import Corte3 from "../pages/Corte3";
import HomeTeacher from "../pages/HomeTeacher";
import CreateUser from "../pages/CreateUser";
import { CreateSubject } from "../pages/CreateSubject";
import UpdateStudentForm from "../pages/UpdateStudent";
import UpdateUser from "../pages/UpdateUser";
import { UpdateSubject } from "../pages/updateSubject";


export const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        element: <PrivateRoute allowedRoles={[UserRole.EJECUTIVO]} />,
        children: [
            {
                path: "/admin/home",
                element: <AppLayout><StudentDashboard /></AppLayout>
            }, 
            {
                path: "/admin/home/:id/update",
                element: <AppLayout><UpdateStudentForm /></AppLayout>
            },
            {
                path: "/admin/new-student",
                element: <AppLayout><NewStudentForm /> </AppLayout>
            },
            {
                path: "/admin/new-user",
                element: <AppLayout><CreateUser /></AppLayout>
            },
            {
                path: "/admin/new-user/:id/update",
                element: <AppLayout><UpdateUser /></AppLayout>
            },
            {
                path: "/admin/new-subject",
                element: <AppLayout><CreateSubject /></AppLayout>

            },
            {
                path: "/admin/new-subject/:id/update",
                element: <AppLayout><UpdateSubject /></AppLayout>

            }
        ]
    },
    {
        element: <PrivateRoute allowedRoles={[UserRole.PROFESOR]} />,
        children: [
            {
                path: "/teacher/students",
                element: <AppLayout><HomeTeacher /></AppLayout>
            },
            {
                path: "/teacher/student/corte/1",
                element: <AppLayout><Corte1 /></AppLayout>
            },

            {
                path: "/teacher/student/corte/2",
                element: <AppLayout><Corte2 /></AppLayout>
            },

            {
                path: "/teacher/student/corte/3",
                element: <AppLayout><Corte3 /></AppLayout>
            }
        ]
    },
    {
        path: "/unauthorized",
        element: <div><h1>Acceso Denegado</h1><p>No tienes permiso para ver esta página.</p></div>
    }
]);