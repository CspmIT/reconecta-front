import { TextField, MenuItem, Button, Fab } from '@mui/material';
import CardCustom from '../../../../components/CardCustom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { request } from '../../../../utils/js/request.js';
import { backend } from '../../../../utils/routes/app.routes.js';
import { status } from '../../utils/status';
import { type_task } from '../../utils/type_task';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowBack } from '@mui/icons-material';
import LoaderComponent from '../../../../components/Loader/index.jsx';

function BinnacleAdd({ changeView, id }) {
  const [dataActivos, setDataActivos] = useState([]);
  const [newActivo, setNewActivo] = useState('');
  const [recordData, setRecordData] = useState(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [isCustomActivo, setIsCustomActivo] = useState(false);
  const navigate = useNavigate();
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);


  //OBTENER LOS ACTIVOS PARA ASIGNARLE UNA TAREA
  const getActivos = async () => {
    try {
      const { data } = await request(`${backend.Reconecta}/Elements`, 'GET');
      if (data) {
        setDataActivos(data);
      }
    } catch (error) {
      console.error('Error al obtener los activos:', error);
    }
  };

  //OBTENER EL REGISTRO DE LA TAREA PARA EDITARLO
  const getBinnacleData = async (id) => {
    try {
      setIsLoadingRecord(true); 
      const { data } = await request(`${backend.Reconecta}/Binnacle/${id}`, 'GET');
      setRecordData(data);
    } catch (error) {
      console.error('Error al obtener los datos del registro:', error);
    } finally {
      setIsLoadingRecord(false); 
    }
  };

  useEffect(() => {
    getActivos();
    if (id) {
      getBinnacleData(id);
    }
  }, [id]);

  //COMPLETA LOS CAMPOS DEL FORMULARIO CON LOS DATOS DEL REGISTRO
  useEffect(() => {
    if (recordData && recordData.length > 0) {
      const record = recordData[0];
  
      // Verifica si es un valor personalizado
      const isCustom = !record.id_element;
  
      if (isCustom) {
        setIsCustomActivo(true);
        setNewActivo(record.name_element);
        setValue('activo', 'custom'); // Para que el input sepa que es personalizado
      } else {
        setIsCustomActivo(false);
        // Asumimos que el input es un select y necesita un objeto { id, label } o similar
       setValue('activo', String(record.id_element));
      }
  
      setValue('latitud', record.lat);
      setValue('longitud', record.lon);
      setValue('tarea', record.task);
  
      const tipoTarea = type_task.find((task) => task.name === record.type_task);
      const estado = status.find((state) => state.name === record.status);
  
      if (tipoTarea) setValue('tipoTarea', tipoTarea.id);
      if (estado) setValue('estado', estado.id);
    }
  }, [recordData, setValue, type_task, status]);
  


  const onSubmit = async (data) => {
    try {
      if (Object.values(data).some(value => value === "")) {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Por favor complete todos los campos requeridos.',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      const selectedTypeTask = type_task.find(task => task.id === data.tipoTarea);
      const selectedStatus = status.find(state => state.id === data.estado);

      const isCustomActivo = data.activo === 'custom';

      const recordData = {
        id: id || 0,
        id_element: isCustomActivo ? null : data.activo, 
        name_element: isCustomActivo ? newActivo : null, 
        lat: data.latitud,
        lon: data.longitud,
        task: data.tarea,
        type_task: selectedTypeTask ? selectedTypeTask.name : '',
        order: null,
        status: selectedStatus ? selectedStatus.name : '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let response;
      if (id === 0) {
        response = await request(`${backend.Reconecta}/Binnacle`, 'POST', recordData);
      } else if (id > 0) {
        response = await request(`${backend.Reconecta}/Binnacle/${id}/update`, 'PATCH', recordData);
      }

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El registro fue añadido correctamente.',
          confirmButtonText: 'Aceptar',
        });
        changeView(0);
      } else {
        throw new Error('Error al guardar el registro');
      }
    } catch (error) {
      console.error('Error al enviar los datos', error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un problema al guardar el registro. Intente nuevamente.',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  if (id && isLoadingRecord) {
    return (
      <div className="w-full">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center rounded-md text-black">
      <CardCustom className="w-full rounded-md text-black flex justify-center flex-wrap gap-6 p-6 dark:!bg-zinc-500 !border-zinc-200 dark:!border-gray-700">
        <div className="w-full mb-6 flex items-center">
          <div className="flex-grow text-center">
            <p className="text-2xl ps-10 dark:text-white"> {id ? "Editar registro" : "Añadir nuevo registro"} </p>
          </div>
          <div>
            <Fab
              onClick={() => changeView(0)}
              className="!flex !justify-center !items-center"
              size="small"
              color="primary"
              aria-label="add"
            >
              <ArrowBack />
            </Fab>
          </div>
        </div>

        <div className="w-full flex justify-center gap-6 mb-3 text-center ">
          <TextField
            className="w-[50%] text-start dark:bg-zinc-400"
            select
            label="Activo *"
            {...register('activo', { required: 'Debe seleccionar una opcion' })}
            error={!!errors.activo}
            helperText={errors.activo?.message}
            value={watch('activo') || ''}
            onChange={(e) => {
              const selectedValue = e.target.value;
              const selectedActivo = dataActivos.find(element => element.id === selectedValue);
              console.log(selectedActivo, selectedValue)
              if (selectedValue === 'custom') {
                setIsCustomActivo(true);
                setNewActivo('');
                setValue('activo', 'custom');
                setValue('longitud', '');
                setValue('latitud', '');
              } else {
                setIsCustomActivo(false);
                setNewActivo('');
                setValue('activo', selectedValue);

                if (selectedActivo) {
                  setValue('longitud', selectedActivo.lon);
                  setValue('latitud', selectedActivo.lat);
                }
              }
            }}
          >
            {dataActivos.map((element) => (
              <MenuItem key={element.id} value={element.id}>
                {element.name}
              </MenuItem>
            ))}
            <MenuItem value="custom">Otro...</MenuItem>
          </TextField>
          {/* Mostrar el campo "Nuevo Activo" si se selecciona "Otro..." */}
          {isCustomActivo && (
            <TextField
              className="w-[50%] dark:bg-zinc-400"
              label="Nuevo Activo"
              {...register('newActivo', { required: 'Debe ingresar un valor' })}
              value={newActivo}
              onChange={(e) => setNewActivo(e.target.value)}
              required
            />
          )}
        </div>

        <form
          id="formAbmBinnacle"
          className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            className="w-full col-span-4 md:col-span-2 dark:bg-zinc-400"
            label="Longitud *"
            type="text"
            {...register('longitud', { required: 'La longitud es requerida' })}
            disabled={!isCustomActivo && !!watch('longitud')}
            error={!!errors.longitud}
            helperText={errors.longitud?.message}
            InputLabelProps={{ shrink: Boolean(watch('longitud')) }}
          />

          <TextField
            className="w-full col-span-4 md:col-span-2 dark:bg-zinc-400"
            label="Latitud *"
            type="text"
            {...register('latitud', { required: 'La latitud es requerida' })}
            disabled={!isCustomActivo && !!watch('latitud')}
            error={!!errors.latitud}
            helperText={errors.latitud?.message}
            InputLabelProps={{ shrink: Boolean(watch('latitud')) }}
          />

          <TextField
            className="w-full col-span-4 md:col-span-1 dark:bg-zinc-400"
            select
            label="Tipo de tarea *"
            {...register('tipoTarea', { required: 'El tipo de tarea es requerido' })}
            error={!!errors.tipoTarea}
            helperText={errors.tipoTarea?.message}
            onChange={(e) => setValue('tipoTarea', e.target.value)}
            value={watch('tipoTarea') || ''}
          >
            {type_task.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>
                {tipo.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            className="w-full col-span-4 md:col-span-2 dark:bg-zinc-400"
            label="Tarea realizada *"
            type="text"
            {...register('tarea', { required: 'La tarea es requerida' })}
            error={!!errors.tarea}
            helperText={errors.tarea?.message}
            InputLabelProps={{ shrink: Boolean(watch('tarea')) }}
          />

          <TextField
            className="w-full col-span-4 md:col-span-1 dark:bg-zinc-400"
            select
            label="Estado *"
            {...register('estado', { required: 'El estado es requerido' })}
            error={!!errors.estado}
            helperText={errors.estado?.message}
            onChange={(e) => setValue('estado', e.target.value)}
            value={watch('estado') || ''}
          >
            {status.map((estado) => (
              <MenuItem key={estado.id} value={estado.id}>
                {estado.name}
              </MenuItem>
            ))}
          </TextField>

          <div className="w-full flex justify-center mt-6 col-span-4">
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </div>
        </form>
      </CardCustom>
    </div>
  );
}

export default BinnacleAdd;
