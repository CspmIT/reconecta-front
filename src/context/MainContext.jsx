import { createContext, useState } from 'react'

const MainContext = createContext()

function MainProvider({ children }) {
    const [tabActive, setTabActive] = useState(0)
    const [tabs, setTabs] = useState([
        {
            name: 'Hola',
            component: (
                <>
                    <h1 className='text-black'>Holaaa 1</h1>
                </>
            )
        },
        {
            name: '',
            component: (
                <>
                    <h1 className='text-black'>Holaaa 2</h1>
                </>
            )
        },
        {
            name: 'Hola3',
            component: (
                <>
                    <h1 className='text-black'>Holaaa 3</h1>
                </>
            )
        },
        {
            name: 'Hola4',
            component: (
                <>
                    <Map />
                </>
            )
        }
    ])
    return <MainContext.Provider value={{ tabActive, setTabActive, tabs, setTabs }}>{children}</MainContext.Provider>
}
export { MainContext, MainProvider }
