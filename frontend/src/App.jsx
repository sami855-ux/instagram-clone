import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { io } from "socket.io-client"
import { useEffect } from "react"

import ProtectedRoutes from "./components/ProtectedRoutes"
import ExplorePeople from "./components/ExplorePeople"
import EditProfile from "./components/EditProfile"
import MainLayout from "./components/MainLayout"
import ChatPage from "./components/ChatPage"
import Explore from "./components/Explore"
import Home from "./components/Home"
import Login from "./components/Login"
import Profile from "./components/Profile"
import Signup from "./components/Signup"

import { setSocket } from "./redux/socketSlice"
import { setOnlineUsers } from "./redux/chatSlice"
import { setLikeNotification } from "./redux/rtnSlice"
import StoryViewer from "./components/StoryViewer"

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/explore",
        element: (
          <ProtectedRoutes>
            <Explore />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/explore/people",
        element: (
          <ProtectedRoutes>
            <ExplorePeople />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/story/:storyId",
    element: <StoryViewer />,
  },
])

function App() {
  const { user } = useSelector((store) => store.auth)
  const { socket } = useSelector((store) => store.socketio)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:3000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      })
      dispatch(setSocket(socketio))

      socketio.on("connect", () => {
        dispatch(setSocket(socketio))
      })

      // listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification))
      })

      return () => {
        // Only close the socket if it was successfully connected
        if (socketio.connected) {
          socketio.disconnect()
        }
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch])

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
