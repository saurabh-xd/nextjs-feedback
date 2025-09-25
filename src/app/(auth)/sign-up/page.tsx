'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import axios, {AxiosError} from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

const Page = () => {
  const [username, setusername] = useState('')
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

 const debounced = useDebounceCallback(setusername, 300)
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
    if (username) {
      setisCheckingUsername(true)
      setusernameMessage('')

      try {
      const response  = await axios.get(`/api/check-username-unique?username=${username}`)
      
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
 },[username])

 const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{
  setisSubmitting(true)
  console.log(data);
  try {
    const response = await axios.post<ApiResponse>('/api/sign-up', data)
    
    
     toast("Account created successfully", {
          description: response.data.message,
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
     const errorMessage = axiosError.response?.data.message

     
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message</h1>
              <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">

                 <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}/>

               
              </FormControl>
               {
                    isCheckingUsername && <Loader2 className="animate-spin"/>
                }

                <p className={`text-sm ${usernameMessage === "username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                </p>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email" {...field} 
               />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} 
               />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
         {
          isSubmitting ? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            </>
          ) : ('Signup')
         }
        </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
              <p>
                Already a member?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign in
                </Link>
              </p>
          </div>
      </div>
    </div>
  )
}

export default Page