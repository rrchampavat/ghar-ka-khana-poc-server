import { emailRegEx } from "@constants/regularExpressions";
import z from "zod";

const loginSchema = z.object({
  body: z
    .object({
      emailOrContact: z.string().transform((value) => {
        const trimmedValue = value.trim();

        if (emailRegEx.test(trimmedValue)) {
          return trimmedValue;
        }
      }),
      password: z.string({
        required_error: "Please provide a password; it is a required field.",
        invalid_type_error: "Ensure that the password is entered as a string."
      })
    })
    .strict()
});

export default loginSchema;
