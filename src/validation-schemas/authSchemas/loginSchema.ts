import { emailRegEx } from "@constants/regularExpressions";
import z from "zod";

const loginSchema = z.object({
  body: z
    .object({
      emailOrContact: z
        .string()
        .nonempty({
          abort: true,
          error: "Email or contact number is a required field."
        })
        .transform((value) => {
          const trimmedValue = value.trim();

          if (emailRegEx.test(trimmedValue)) {
            return trimmedValue;
          }
        }),
      password: z
        .string({
          error: "Ensure that the password is entered as a string."
        })
        .nonempty({ error: "Password is a required field." })
    })
    .strict()
});

export default loginSchema;
