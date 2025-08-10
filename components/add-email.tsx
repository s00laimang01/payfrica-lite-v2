import { IAddEmail } from "@/types";
import React, { FC } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "lucide-react";
import { Input } from "./ui/input";

const emailSchema = z.object({
  email: z.email(),
});

export const AddEmail: FC<IAddEmail> = ({ email, ...props }) => {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email,
    },
  });

  const onSubmit = (value: z.infer<typeof emailSchema>) => {
    props?.onEmailSubmit?.(value.email);
  };

  return (
    <Form {...form}>
      <form action="" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {props.label && <FormLabel>{props.label}</FormLabel>}
              <FormControl>
                <Input
                  placeholder="payfricaV2@gmail.com"
                  className="h-[3rem]"
                  {...field}
                  value={email || ""}
                  onChange={(e) => {
                    form.setValue("email", e.target.value);
                    props?.onEmailChange?.(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
