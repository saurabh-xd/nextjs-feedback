'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { toast } from "sonner"
import React from 'react'
import {  useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import  { signIn }  from "next-auth/react";


const Page = () => {
  
 


 const router = useRouter()

 //Zod implemenation
 const form = useForm({
  resolver: zodResolver(signInSchema),
  defaultValues: {
    identifier: '',
    password: ''
  }
 })

 

 const onSubmit = async (data: z.infer<typeof signInSchema>) =>{
   const result = await signIn('credentials',
     { redirect: false,
      identifier: data.identifier,
      password: data.password }
    )
    if(result?.error){
       toast("signIn failed", {
        description: "incorrect username or password"
       })
    }

    if(result?.url){
        router.replace('/dashboard')
    }
  
 }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message</h1>
              <p className="mb-4">Sign In to start your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">

                

         <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="email/username" {...field} 
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
        <Button type="submit" className="cursor-pointer">
         Signin
        
        </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
              <p>
               Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign up
                </Link>
              </p>
          </div>
      </div>
    </div>
  )
}

export default Page