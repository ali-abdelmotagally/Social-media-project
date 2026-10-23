import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';
import showPasswordIcon from "../../assets/2540381-200.png";
import hidePassword from "../../assets/eye-password-see-view.svg";
import uprightArrow from "../../assets/upright-arrow.svg";

// we will continue to validate with zod


export default function Register() {
  
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const schema = z.object({
    name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be 20 characters maximum"),

    email: z
    .string()
    .min(1, "Email field is required.")
    .email("Please enter a valid email."),

    password: z
    .string()
    .min(1, "Password field is required.")
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Please enter a strong password"),

    rePassword: z
    .string()
    .min(1, "Confirm Password field is required."),

   
    dateOfBirth: z
  .string()
  .min(1, "Date of birth is required.")
  .refine((date) => {
    const birthDate = new Date(date);

    if (Number.isNaN(birthDate.getTime())) return false;

    const today = new Date();
    const cutoff = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    return birthDate <= cutoff;
  }, "You must be at least 18 years old to register."),

  gender: z.enum(["male", "female"], {
  error: "Please select your gender.",
  }), 

  }).refine((object) => {
    if(object.password === object.rePassword){
      return true
    }
    return false
  },
  {error: "Passwords do not match.", path: ["rePassword"]},
)

   const form = useForm({
    defaultValues: {
        name: "",
        email: "",
        password: "",
        rePassword: "",
        dateOfBirth: "",
        gender: "",
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

    
async function handleRegister(values) {
  setIsLoading(true);
  setApiError("");

  try {
    const response = await axios.post(
      "https://route-posts.routemisr.com/users/signup",
      values
    );

    console.log(response.data);

    if (response.data.success) {
      navigate("/login");
    } else {
      setApiError(response.data.message || "Registration failed.");
    }
  } catch (error) {
    console.log(error.response?.data || error.message);

    setApiError(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed."
    );
  } finally {
    setIsLoading(false);
  }
}

  return (
    <>
    
    <div className="max-w-full flex items-center justify-center text-center">
    <h1
    className='font-bold text-2xl mt-4'>
        Register Now
   </h1>
   {apiError ? <p className="w-full bg-red-200 text-red-800"></p> : null}
    </div>

    {/* here, we continue further with RHF's features and validate the form with it instead of manually */}
<form onSubmit={handleSubmit(handleRegister)} className=" w-87.5 mx-auto mt-8 border border-[#f1f1f1] p-4 rounded-2xl shadow-sm shadow-[#dddcdc] md:w-3xl lg:w-4xl">
    <div className="relative z-0 w-full mb-5 group">
      <input
      //this is a validation using RHF
      { ...register("name", {
        // required: {value: true, message: "Name is a required field"},
        // minLength: {value: 3,  message: "Name must be at least 3 characters."}
      })} 
      type="text" 
      id="name" 
      className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" "  />
      <label htmlFor="name" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Name</label>

      {formState.errors.name && formState.touchedFields.name && <p className='bg-red-200 text-red-800 w-fit px-2 rounded-sm'>⚠︎ {formState.errors.name?.message}</p>}

    </div>
  
  <div className="relative z-0 w-full mb-5 group">
    <input 
    { ...register("email", {
      // pattern: {value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, message: "Invalid email."}
    })}
    type="email" 
    id="email" 
    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" "  />
    <label htmlFor="email" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email address</label>

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
    className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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


    {formState.errors.password && formState.touchedFields.password && <p className='bg-red-200 text-red-800 w-fit px-2 rounded-sm'>⚠︎ {formState.errors.password?.message}</p>}


  <div className="relative z-0 w-full mb-5 group">
    <input
    { ...register("rePassword", {
      // validate: function(rePasswordValue){
      //   if(rePasswordValue === getValues("password")){
      //     return true
      //   }
      //   else{
      //     return "Password do not match."
      //   }
      // }
    })}
      
    type="password" 
    id="rePassword" 
    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" "  />
    <label htmlFor="rePassword" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Confirm password</label>

    {formState.errors.rePassword && formState.touchedFields.rePassword && <p className='bg-red-200 text-red-800 w-fit px-2 rounded-sm'>⚠︎ {formState.errors.rePassword?.message}</p>}

  </div>


    <div className="relative z-0 w-full mb-5 group">
      <input
      { ...register("dateOfBirth", {
        // valueAsDate: true,
        // validate: function(value){

        //   const userDate = value.getFullYear
        //   const currDate = new Date().getFullYear()

        //   if(currDate - userDate >= 18){
        //     return true;
        //   }
        //   else{
        //     return "You must be at least 18 to register"
        //   }
        // }

      })}
      type="date" 
      id="dateOfBirth" 
      className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" "  />
      <label htmlFor="dateOfBirth" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-100 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Date of birth</label>

      {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth && <p className='bg-red-200 text-red-800 w-fit px-2 rounded-sm'>⚠︎ {formState.errors.dateOfBirth?.message}</p>}

   </div>

<div className="flex gap-4 w-full">
<div className="flex items-center mb-4">
    <input id="male" 
    type="radio" 
    value="male"
    { ...register("gender")}
    className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"/>
    <label htmlFor="male" className="select-none ms-2 text-sm font-medium text-heading">
      Male
    </label>
    </div>
   <div className="flex items-center mb-4">
    <input id="female" 
    type="radio"
    value="female"
    { ...register("gender")}
    className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"/>
    <label htmlFor="female" className="select-none ms-2 text-sm font-medium text-heading">
      Female
    </label>
    </div>
  </div>
   {formState.errors.gender && formState.touchedFields.gender && <p className='bg-red-200 text-red-800 w-fit px-2 rounded-sm'>⚠︎ {formState.errors.gender?.message}</p>}


  <button 
  disabled={isLoading}
  type="submit" 
  className="text-black bg-white rounded-lg disabled:bg-[#f1f1f1] disabled:cursor-not-allowed shadow-md shadow-[#dddcdc] font-medium rounded-base text-sm px-4 py-2 cursor-pointer block w-full border border-[#f1f1f1] hover:bg-[#f2f2f2] hover:shadow-lg transition-shadow ">
    {isLoading? "Registering..." : "Register"}
  </button>
</form>

<div className='flex flex-col w-full h-full items-center justify-center mt-8 '>
<p className="">Already have an account?</p>
<Link to='/login' className="text-slate-600 hover:text-black  transition-colors hover:underline">Log in instead <img className='w-3 inline-block ml-1' src={uprightArrow} alt='Upright arrow'></img> </Link>
</div>


    </>
  )
}
