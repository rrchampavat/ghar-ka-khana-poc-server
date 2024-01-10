import { BCRYPT_SALT } from "@constants/envVars.ts";
import httpStatusCode from "@constants/httpStatusCode.ts";
import db from "@db/connection.ts";
import { users } from "@db/schemas/userSchema.ts";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { body }: { body: REGISTER_BODY } = req;

    const { firstName, lastName, email, password, contactNo, userImage } = body;

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

    if (existingEmail.length)
      return res
        .status(httpStatusCode["BAD_REQUEST"])
        .json({ message: "Email is already in use!", success: false });

    const existingContactNo = await db
      .select({ contact_no: users.contact_no })
      .from(users)
      .where(eq(users.contact_no, contactNo));

    // const contactNoExistsQuery = db.execute(
    //   sql`SELECT ${users.contact_no} FROM ${users} WHERE ${users.contact_no} = ${contactNo};`
    // );
    //
    // const existingContactNo = await contactNoExistsQuery;

    if (existingContactNo.length)
      return res
        .status(httpStatusCode["BAD_REQUEST"])
        .json({ message: "Contact number is already in use!", success: false });

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

    await db.insert(users).values({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      contact_no: contactNo,
      role: 0,
      user_image: userImage
    });

    // const insertUserQuery = sql`INSERT INTO ${users} (first_name, last_name, email, password, contact_no, role_id, user_image)
    //         VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${contactNo}, 0, ${userImage})`;
    //
    // const executableInsertQuery = generateExecutableQuery(insertUserQuery);

    // await executableInsertQuery;

    return res
      .status(httpStatusCode["SUCCESS"])
      .json({ message: "User created successfully!", success: true });
  } catch (error: any) {
    return res
      .status(httpStatusCode["SERVER_ERROR"])
      .json({ message: "Something went wrong", success: false });
  }
};
