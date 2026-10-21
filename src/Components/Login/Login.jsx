import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import showPasswordIcon from "../../assets/2540381-200.png";
import hidePassword from "../../assets/eye-password-see-view.svg"

// we will continue to validate with zod


export default function Login() {
  
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const schema = z.object({
    email: z
    .string()
    .min(1, "Email field is required.")
    .email("Please enter a valid email."),

    password: z
    .string()
    .min(1, "Password field is required.")
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Please enter a strong password"),
  })
  
   const form = useForm({
    defaultValues: {
        email: "",
        password: "",
    },
    resolver: zodResolver(schema),
   });

   const {register, handleSubmit, getValues, formState} = form; //regsiter() is a function inside RHF. It registers the fields in the useForm() and returns: name, onChange(), onBlur() and ref

// const {name, onChange, onBlur, ref} = register; register() returns an object containing all these four props, we only need "name" for the value in the form

//handleSubmit() is a function inside RHF. It literally handles the onSubmit() in the form: it prevents the default event "refresh" on submit, prevents submit if validation is false and finally calls the object for us with the new values.

   //this is how we prevent refresh on submit manually:

    // function handleSubmit(e){
    //     e.preventDefault()
    // }

    
function handleLogin(values) {
  setIsLoading(true);
  setApiError("");

  axios
    .post("https://linked-posts.routemisr.com/users/signin", values)
    .then((res) => {
      console.log(res.data);

      if (res.data.message === "success") {
        navigate("/Home");
      } else {
        setApiError(res.data.message || "Registration failed.");
      }
    })
    .catch((error) => {
      setApiError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message
      );
    })
    .finally(() => {
      setIsLoading(false);
    });
}

  return (
    <>
    
    <div className="max-w-full text-center">
    <h1
    className='font-bold text-2xl mt-4'>
        Log in
   </h1>
   {apiError ? <p className='w-full bg-red-200 text-red-800'></p> : null}
    </div>

    {/* here, we continue further with RHF's features and validate the form with it instead of manually */}
<form onSubmit={handleSubmit(handleLogin)} className=" w-87.5 mx-auto mt-8 border border-[#f1f1f1] p-4 rounded-2xl shadow-sm shadow-[#dddcdc] md:w-3xl lg:w-4xl">
  <div className="relative z-0 w-full mb-5 group">
    <input 
    { ...register("email", {
      // pattern: {value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, message: "Invalid email."}
    })}
    type="email" 
    id="email" 
    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" "  />
    <label htmlFor="email" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email address</label>

    {formState.errors.email && formState.touchedFields.email && <p className='bg-red-200 text-red-800 w-fit px-2 rounded-sm'>⚠︎ {formState.errors.email?.message}</p>}

  </div>

 <div className="relative z-0 w-full mb-5 group flex border-b-2">
   <input
     {...register("password")}
     type={showPassword ? "text" : "password"}
     id="password"
     className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
     placeholder=" "
   />
 
   <label
     htmlFor="password"
     className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
   >
     Password
   </label>
 
   <button
     type="button"
     onClick={() => setShowPassword(!showPassword)}
     className="ml-2 cursor-pointer"
     aria-label={showPassword ? "Hide password" : "Show password"}
   >
     <img
       src={showPassword ? hidePassword : showPasswordIcon}
       alt=""
       className="w-5 h-5"
     />
   </button>
 </div>
  

  <button 
  disabled={isLoading}
  type="submit" 
  className="text-black bg-white rounded-lg disabled:bg-[#f1f1f1] disabled:cursor-not-allowed shadow-md shadow-[#dddcdc] font-medium rounded-base text-sm px-4 py-2 cursor-pointer block w-full border border-[#f1f1f1] hover:bg-[#f2f2f2] hover:shadow-lg transition-shadow ">
    {isLoading? "Loading..." : "Log in"}
  </button>
</form>


    </>
  )
}
