import { Tab, Tabs, MenuItem, Select, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import { CustomTabPanel, a11yProps } from './PanelTab'

function TabsHome({ tabs }) {
  const [value, setValue] = useState(0)
  const isSmallScreen = useMediaQuery('(max-width: 640px)') // Detectar pantallas pequeñas

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSelectChange = (event) => {
    setValue(event.target.value)
  }

  const classTabs =
    '!border-solid !border-gray-200 !rounded-t-xl !text-base !text-black !font-bold dark:!text-zinc-200 dark:!border-gray-700'
  const classTabStatus = [
    '!bg-white !border-r-2 !border-t-2 !border-l-2 dark:!bg-zinc-500',
    '!border-b-2 !bg-gray-300 dark:!bg-zinc-700 hover:dark:!bg-zinc-500 hover:!bg-zinc-400',
  ]

  return (
    <div className={`w-full !rounded-xl flex flex-col items-start`}>
      {isSmallScreen ? (
        <Select
          value={value}
          onChange={handleSelectChange}
          className="w-full mb-4 bg-white dark:bg-zinc-700 dark:text-white rounded-lg"
        >
          {tabs.map((item, index) => (
            <MenuItem key={index} value={index}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Tabs
          indicatorColor='transparent'
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
          className='w-full flex flex-wrap justify-center md:justify-start'
        >
          {tabs.map((item, index) => (
            <Tab
              key={index}
              className={`flex-grow sm:w-auto w-full !mr-1 relative ${
                classTabStatus[value === index ? 0 : 1]
              } ${classTabs}`}
              label={
                <p className='text-black dark:text-white w-full text-center'>
                  {item.title}
                </p>
              }
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      )}

      <div className={`bg-white dark:bg-zinc-500 w-full h-full flex-col justify-center items-center border-2 border-t-0 !p-4 rounded-b-2xl border-zinc-200 dark:!border-gray-700`}>
        {tabs.map((item, index) => (
          <CustomTabPanel
            key={index}
            value={value}
            index={index}
            className={'w-full flex max-sm:flex-col flex-wrap justify-evenly'}
          >
            {item.component}
          </CustomTabPanel>
        ))}
      </div>
    </div>
  )
}

export default TabsHome
