import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/homepage/Homepage';
import DashboardPage from './routes/dashboardPage/DashboardPage';
import ChatPage from './routes/chatPage/ChatPage';
import RootLayout from './layouts/rootLayout/RootLayout';
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import SignInPage from './signInPage/signInPage';
import SignUpPage from './signUpPage/signUpPage';

const router = createBrowserRouter([
  {
    path: "/", // Ensure path is specified for the root layout
    element: <RootLayout />,
    children: [
      {
        path: "/", // Homepage route
        element: <Homepage />,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        element: <DashboardLayout />, // Dashboard layout for nested routes
        children: [
          {
            path: "/dashboard", // Dashboard page route
            element: <DashboardPage />
          },
          {
            path: "/dashboard/chats/:id", // Chat page route
            element: <ChatPage />
          }
        ]
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
