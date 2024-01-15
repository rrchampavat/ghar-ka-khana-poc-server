import { BCRYPT_SALT } from "@constants/envVars";
import db from "@db/connection";
import { users } from "@db/schemas/userSchema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { duplicateEntry, postSuccess } from "@helpers/httpResponseGenerator";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: REGISTER_BODY } = req;

    const { firstName, lastName, email, password, contactNo } = body;

    const existingEmail = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email));

    // const existingEmail = await db.query.users.findMany({
    //   columns: {
    //     email: true
    //   }
    // });

    // const existingEmailQuery = db.execute(
    //   sql`SELECT ${users.email} FROM ${users} WHERE ${users.email} =
    //   ${email};`
    // );
    //
    // const existingEmail = await existingEmailQuery;

    if (existingEmail.length) {
      return duplicateEntry(
        res,
        "This email address has already been registered. Please use a different one."
      );
    }

    const existingContactNo = await db
      .select({ contact_no: users.contact_no })
      .from(users)
      .where(eq(users.contact_no, contactNo));

    // const contactNoExistsQuery = db.execute(
    //   sql`SELECT ${users.contact_no} FROM ${users} WHERE ${users.contact_no} = ${contactNo};`
    // );
    //
    // const existingContactNo = await contactNoExistsQuery;

    if (existingContactNo.length) {
      return duplicateEntry(
        res,
        "This contact number is already associated with an account. Please use a different one."
      );
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

    await db.insert(users).values({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      contact_no: contactNo,
      role: 0
    });

    // const insertUserQuery = sql`INSERT INTO ${users} (first_name, last_name, email, password, contact_no, role_id, user_image)
    //         VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${contactNo}, 0, ${userImage})`;
    //
    // const executableInsertQuery = generateExecutableQuery(insertUserQuery);

    // await executableInsertQuery;

    return postSuccess(
      res,
      "Congratulations! You have successfully registered."
    );
  } catch (error) {
    return next(error);
  }
};
