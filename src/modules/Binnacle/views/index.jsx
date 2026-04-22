import React, { useState } from 'react';
import BinnacleList from '../Components/List';
import BinnacleAdd from '../Components/Add';
import CardCustom from '../../../components/CardCustom';
import { FormLabel } from '@mui/material';

const Binnacle = () => {
  const [view, setView] = useState(0);
  const [recordId, setRecordId] = useState(0); // Estado para almacenar el ID

  const handleViewChange = (id = 0) => {
    setRecordId(id); // Si es nuevo, id será 0
    setView(1); // Cambiar la vista al formulario
  };

  return (
    <>
      {/* {view === 0 && <BinnacleList changeView={handleViewChange} />}
      {view === 1 && <BinnacleAdd changeView={setView} id={recordId} />}	 */}
      <CardCustom className={' text-black flex flex-col p-4 w-full'}>
        <FormLabel className='w-full text-center !text-3xl'>Bitácora</FormLabel>
        <FormLabel className='w-full text-center !text-xl mt-3'>En Desarrollo...</FormLabel>
      </CardCustom>
    </>
  );
};

export default Binnacle;