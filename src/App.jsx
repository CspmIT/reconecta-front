import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainContent from './modules/core/views'
import DashBoard from '../src/modules/dashBoard/views/index'
import Map from './modules/map/views'
import TabDinamic from './modules/tabs/views'
import Login from './modules/login/views'
import Profile from './modules/profile/views'
import Board from './modules/board/views'
// import ForgeViewer from './modules/visualizerAutocad/views'
import Notification from './modules/Notification'

function App() {
    // const [userRoutes, setUserRoutes] = useState([])
    const loginRoutes = [{ path: '/login', element: <Login /> }]
    const userRoutes = [
        { path: '/*', element: <DashBoard /> },
        { path: '/map', element: <Map /> },
        // { path: '/visualizador', element: <ForgeViewer /> },
        { path: '/tabs', element: <TabDinamic /> },
        { path: '/notificaciones', element: <Notification /> },
        { path: '/board/:id', element: <Board /> },
        { path: '/profile', element: <Profile /> }
    ]
    return (
        // <div className='flex min-h-screen overflow-x-hidden  bg-gray-200 dark:bg-gray-600 text-gray-700'>
        <BrowserRouter>
            <Routes>
                {loginRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
                <Route element={<MainContent />}>
                    {userRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
        // </div>
    )
}

export default App
