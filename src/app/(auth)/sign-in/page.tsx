'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import axios, {AxiosError} from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {
  const [username, setusername] = useState('')
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

 const debouncedUsername = useDebounceValue(username, 300)
 const router = useRouter()

 //Zod implemenation
 const form = useForm({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    username: '',
    email: '',
    password: ''
  }
 })

 useEffect(()=>{
  const checkUsernameUnique = async()=>{
    if (debouncedUsername) {
      setisCheckingUsername(true)
      setusernameMessage('')

      try {
      const response  = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
      
      setusernameMessage(response.data.message)
      
      } catch (error) {

        const axiosError = error as AxiosError<ApiResponse>
        setusernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        )
        
      }
      finally{
        setisCheckingUsername(false)
      }
    }
  }
  checkUsernameUnique()
 },[debouncedUsername])

 const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{
  setisSubmitting(true)
  console.log(data);
  try {
    const response = await axios.post<ApiResponse>('/api/sign-up', data)

     toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })

        router.replace(`/verify/${username}`)
        setisSubmitting(false)
    
  } catch (error) {
    console.error("error in signup user");
    
     const axiosError = error as AxiosError<ApiResponse>
     let errorMessage = axiosError.response?.data.message

     
     toast("signup failed", {
          description: errorMessage,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
        setisSubmitting(false)


  }
  
 }
  return (
    <div>page</div>
  )
}

export default page