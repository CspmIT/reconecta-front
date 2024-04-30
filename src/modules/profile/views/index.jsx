import { Box } from "@mui/material";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { MainContext } from "../../../context/MainContext";

const Profile = () => {
  const { user, setUser } = useContext(MainContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data.mail);
  };
  return (
    <div className="w-full">
      <h1 className="text-black dark:text-white font-bold text-center m-5">Mi perfil</h1>
      <hr className="mb-5" />
      <Box sx={{ width: "100%" }}>
        <div className="justify-center flex flex-row">
          <div className="w-4/6 bg-white border-2 p-8 rounded-2xl border-zinc-200 dark:!border-gray-700 dark:!bg-zinc-800">
            <form className="w-full flex flex-row flex-wrap " onSubmit={handleSubmit(onSubmit)}>
              <div className="w-1/3 flex flex-col mt-4  px-5">
                <label className="text-black dark:text-white font-bold">Nombre</label>
                <div className="w-full">
                  <input className="w-full" value={user.first_name || ""} type="text" {...register("first_name", { required: true })} />
                  {errors.mail && <p>Ingresa un mail válido</p>}
                </div>
              </div>
              <div className="w-1/3 flex flex-col mt-4 px-5">
                <label className="text-black dark:text-white font-bold">Apellido</label>
                <div className="w-full">
                  <input className="w-full" value={user.last_name || ""} type="text" {...register("last_name", { required: true })} />
                </div>
              </div>
              <div className="w-1/3 flex flex-col mt-4  px-5">
                <label className="text-black dark:text-white font-bold">Perfil</label>
                <div className="w-full">
                  <input className="w-full" value={user.last_name || "Operario"} type="text" disabled />
                </div>
              </div>
              <div className="w-1/3 flex flex-col mt-4  px-5">
                <label className="text-black dark:text-white font-bold">Email</label>
                <div className="w-full">
                  <input className="w-full" value={user.email || ""} type="email" {...register("mail", { required: true })} />
                  {errors.mail && <p>Ingresa un mail válido</p>}
                </div>
              </div>
              <div className="w-1/3 flex flex-col mt-4 px-5">
                <label className="text-black dark:text-white font-bold">Contraseña</label>
                <div className="w-full">
                  <input className="w-full" type="password" {...register("password", { required: true })} />
                </div>
              </div>
              <div className="w-1/3 flex flex-col mt-4 px-5">
                <label className="text-black dark:text-white font-bold">Telefono</label>
                <div className="w-full">
                  <input className="w-full" value={user.phone || ""} type="text" {...register("phone", { required: true })} />
                </div>
              </div>
              <div className="w-full flex flex-row justify-center mt-8">
                <input className="bg-blue-900 hover:bg-blue-800 text-white cursor-pointer" type="submit" value="Guardar cambios" />
              </div>
            </form>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Profile;
