import { BCRYPT_SALT } from "@constants/envVars";
import db from "@db/connection";
import { users } from "@db/schemas/userSchema";
import bcrypt from "bcryptjs";
import { and, eq, isNull, or } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import {
  badRequestRes,
  duplicateEntry,
  fetchSuccess,
  notFoundRes,
  postSuccess
} from "@helpers/httpResponseGenerator";
// @ts-expect-error
import { LOGIN_REQUEST, REGISTER_REQUEST } from "@types/auth/reqBodyTypes";
import { JWT_EXPIRES_IN } from "@constants/jwt";
import generateJwtToken from "@utils/generateJwtToken";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: REGISTER_REQUEST = req;

    const { firstName, lastName, email, password, contactNo } = body;

    const existingEmail = await db
      .select({ email: users.email })
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deleted_at)));

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
      .where(and(eq(users.contact_no, contactNo), isNull(users.deleted_at)));

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

    const user = await db
      .insert(users)
      .values({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        contact_no: contactNo,
        role: 0
      })
      .returning({ user_id: users.id, user_role: users.role });

    const userID = user[0]?.user_id;
    const userRole = user[0]?.user_role;

    const accessToken = generateJwtToken(
      { user_id: userID, user_role: userRole },
      JWT_EXPIRES_IN
    );

    // const insertUserQuery = sql`INSERT INTO ${users} (first_name, last_name, email, password, contact_no, role_id, user_image)
    //         VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${contactNo}, 0, ${userImage})`;
    //
    // const executableInsertQuery = generateExecutableQuery(insertUserQuery);

    // await executableInsertQuery;

    return postSuccess(
      res,
      "Congratulations! You have successfully registered.",
      { accessToken }
    );
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: LOGIN_REQUEST = req;

    const { emailOrContact, password } = body;

    const contactNo = Number(emailOrContact!) || 0;

    const existingUser = await db.query.users.findFirst({
      columns: {
        created_at: false,
        updated_at: false,
        deleted_at: false
      },
      where: and(
        or(eq(users.email, emailOrContact!), eq(users.contact_no, contactNo)),
        isNull(users.deleted_at)
      )
    });

    if (!existingUser?.id) {
      return notFoundRes(
        res,
        "No user was found with the provided email or contact number."
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      return badRequestRes(res, "The provided credentials do not match.");
    }

    const accessToken = generateJwtToken({
      user_role: existingUser.role,
      user_id: existingUser.id
    });

    const { password: userPassword, ...restUser } = existingUser;

    return fetchSuccess(res, "You have successfully logged in.", {
      user: restUser,
      accessToken
    });
  } catch (error) {
    next(error);
  }
};
