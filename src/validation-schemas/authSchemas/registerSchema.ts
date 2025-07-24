import { contactNoRegEx, passwordRegex } from "@constants/regularExpressions";
import { z } from "zod";

const registerBodySchema = z.object({
  body: z
    .object({
      firstName: z
        .string({
          error: "Ensure that the first name is entered as a text (string)."
        })
        .nonempty({ abort: true, error: "First name is a required field." })
        .min(2, "Ensure that the first name is at least 2 characters long.")
        .max(
          20,
          "Make sure the first name does not exceed 20 characters in length."
        ),
      lastName: z
        .string({
          error: "Ensure that the last name is entered as a text (string)."
        })
        .nonempty({
          abort: true,
          error: "Last name is a required field."
        })
        .min(2, "Ensure that the last name is at least 2 characters long.")
        .max(
          20,
          "Make sure the last name does not exceed 20 characters in length."
        ),
      password: z
        .string()
        .nonempty({
          abort: true,
          error: "Password is a required field."
        })
        .regex(
          passwordRegex,
          "For security reasons, your password must be a minimum of 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
      email: z
        .string({
          error: "Ensure the email is entered in string format."
        })
        .nonempty({
          abort: true,
          error: "Email is a required field."
        })
        .email("Provide an valid email address."),
      contactNo: z
        .string()
        .nonempty({
          abort: true,
          error: "Contact number is a required field."
        })
        .refine((value) => contactNoRegEx.test(String(value)), {
          message:
            "Ensure that the contact number is a string consisting of 10 numeric characters."
        })
    })
    .strict()
});

export default registerBodySchema;
