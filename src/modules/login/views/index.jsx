import React from "react";
import Footer from "../../core/components/Footer";
import { useForm } from "react-hook-form";
import Logo from "../../../assets/img/logoCooptech.png";

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data.mail);
  };
  return (
    <div className="min-h-screen min-w-screen pb-24 relative bg-gray-200 dark:bg-gray-600 flex flex-row justify-center items-center">
      <div className="h-full w-2/3 xl:w-1/3 flex flex-row flex-wrap bg-white justify-center items-center rounded shadow-md p-3">
        <div className="w-9/12 h-auto">
          <img src={Logo} alt="Logotipo Coopech" className="" />
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col mt-4  px-5">
            <label className="text-black font-bold">Email:</label>
            <div className="w-full">
              <input className="w-full" type="email" {...register("mail", { required: true })} />
              {errors.mail && <p>Ingresa un mail válido</p>}
            </div>
          </div>
          <div className="w-full flex flex-col mt-4 px-5">
            <label className="text-black font-bold">Contraseña:</label>
            <div className="w-full">
              <input className="w-full" type="password" {...register("password", { required: true })} />
            </div>
          </div>
          <div className="w-full flex flex-row justify-center mt-8">
            <input className="bg-blue-900 hover:bg-blue-800 text-white cursor-pointer" type="submit" value="Ingresar" />
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
