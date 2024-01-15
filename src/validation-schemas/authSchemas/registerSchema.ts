import { z } from "zod";
import { contactNoRegEx, passwordRegex } from "@constants/regularExpressions";

const registerBodySchema = z.object({
  body: z
    .object({
      firstName: z
        .string({
          required_error:
            "Please provide your first name; it's a required field.",
          invalid_type_error:
            "Ensure that the first name is entered as a text (string)."
        })
        .min(2, "Ensure that the first name is at least 2 characters long.")
        .max(
          20,
          "Make sure the first name does not exceed 20 characters in length."
        ),
      lastName: z
        .string({
          required_error:
            "Please provide your last name; it's a required field.",
          invalid_type_error:
            "Ensure that the last name is entered as a text (string)."
        })
        .min(2, "Ensure that the last name is at least 2 characters long.")
        .max(
          20,
          "Make sure the last name does not exceed 20 characters in length."
        ),
      password: z
        .string()
        .regex(
          passwordRegex,
          "For security reasons, your password must be a minimum of 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
      email: z
        .string({
          required_error: "Please fill out the email field.",
          invalid_type_error: "Ensure the email is entered in string format."
        })
        .email("Kindly enter a valid email address."),
      contactNo: z
        .number()
        .refine((value) => contactNoRegEx.test(String(value)), {
          message:
            "Ensure that the contact number is a string consisting of 10 numeric characters."
        })
    })
    .strict()
});

export default registerBodySchema;
