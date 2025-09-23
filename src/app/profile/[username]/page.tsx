'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

function Profile() {

  const params = useParams()
  const username = params.username

    const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

   const messageContent = form.watch('content');

    const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

       toast(
 response.data.message,  
      );
      form.reset({ ...form.getValues(), content: '' });

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        'Error',{
        description: 'Failed to sent message'} );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
       
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

    </div>
  )
}

export default Profile