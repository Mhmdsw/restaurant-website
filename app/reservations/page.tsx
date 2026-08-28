"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@supabase/supabase-js"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"


// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


// Validation Schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }),

  email: z.string().email({
    message: "Invalid email address"
  }),

  phone: z.string().min(8, {
    message: "Please enter a valid phone number"
  }),

  guests: z.number().min(1, {
    message: "Must have at least 1 guest"
  }),

  date: z.string().min(1, {
    message: "Please pick a date"
  }),

  time: z.string().min(1, {
    message: "Please pick a time"
  }),

  special_requests: z.string().optional(),
})


export default function ReservationsPage() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guests: 1,
      date: "",
      time: "",
      special_requests: "",
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {

      console.log(
        "Supabase URL:",
        process.env.NEXT_PUBLIC_SUPABASE_URL
      )

      console.log(
        "Reservation Data:",
        values
      )


      const { error } = await supabase
        .from("reservations")
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            guests: values.guests,
            date: values.date,
            time: values.time,
            special_requests:
              values.special_requests || null,
          }
        ])


      if (error) {

        console.error(
          "Supabase Error:",
          error
        )

        alert(
          "Failed to reserve: " + error.message
        )

        return
      }


      console.log("Reservation created successfully")

      alert(
        "Reservation made successfully!"
      )

      form.reset()


    } catch (error) {

      console.error(
        "Unexpected Error:",
        error
      )

      alert(
        "Something went wrong"
      )

    }
  }



  return (

    <div className="max-w-lg mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold mb-6">
        Make a Reservation
      </h1>


      <Form {...form}>

        <form
          onSubmit={
            form.handleSubmit(onSubmit)
          }
          className="space-y-6"
        >


          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (

              <FormItem>

                <FormLabel>
                  Name
                </FormLabel>

                <FormControl>

                  <Input
                    placeholder="John Doe"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}
          />



          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (

              <FormItem>

                <FormLabel>
                  Email
                </FormLabel>

                <FormControl>

                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}
          />



          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (

              <FormItem>

                <FormLabel>
                  Phone Number
                </FormLabel>

                <FormControl>

                  <Input
                    placeholder="+961 70 000 000"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}
          />



          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (

              <FormItem>

                <FormLabel>
                  Number of Guests
                </FormLabel>

                <FormControl>

                  <Input
                    type="number"
                    min="1"
                    {...field}

                    onChange={(e) =>
                      field.onChange(
                        Number(e.target.value)
                      )
                    }
                  />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}
          />



          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (

              <FormItem>

                <FormLabel>
                  Date
                </FormLabel>

                <FormControl>

                  <Input
                    type="date"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}
          />



          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (

              <FormItem>

                <FormLabel>
                  Time
                </FormLabel>

                <FormControl>

                  <Input
                    type="time"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}
          />



          <FormField
            control={form.control}
            name="special_requests"
            render={({ field }) => (

              <FormItem>

                <FormLabel>
                  Special Requests
                </FormLabel>

                <FormControl>

                  <Textarea
                    placeholder="Dietary restrictions..."
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}
          />



          <Button
            type="submit"
            className="w-full"
          >
            Submit Reservation
          </Button>


        </form>

      </Form>


    </div>

  )
}