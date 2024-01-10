import { z } from "zod";
import {
  contactNoRegEx,
  passwordRegex
} from "@constants/regularExpressions.ts";

const registerBodySchema = z.object({
  body: z
    .object({
      firstName: z
        .string({
          required_error: "The first name field must be filled out.",
          invalid_type_error: "The first name should be in string format."
        })
        .min(2, "The first name must have a minimum length of 2 characters.")
        .max(20, "The length of the first name must not exceed 20 characters."),
      lastName: z
        .string({
          required_error: "The last name field must be filled out.",
          invalid_type_error: "The last name should be in string format."
        })
        .min(2, "The last name must have a minimum length of 2 characters.")
        .max(20, "The length of the last name must not exceed 20 characters."),
      password: z
        .string()
        .regex(
          passwordRegex,
          "The password must be a minimum of 8 characters in length and must include at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
      email: z
        .string({
          required_error: "The email field must be filled out.",
          invalid_type_error: "The email should be in string format."
        })
        .email("Kindly provide a valid email address."),
      contactNo: z
        .number()
        .refine((value) => contactNoRegEx.test(String(value)), {
          message: "Contact number must be a string of 10 numeric characters."
        }),
      userImage: z
        .string({
          invalid_type_error: "The first name should be in string format."
        })
        .nullable()
    })
    .strict()
});

export default registerBodySchema;
