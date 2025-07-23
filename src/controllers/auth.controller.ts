import { BCRYPT_SALT } from "@constants/envVars";
import { JWT_EXPIRES_IN } from "@constants/jwt";
import db from "@db/connection";
import { roles } from "@db/schemas/rolesSchema";
import { userRoles } from "@db/schemas/userRolesSchema";
import { users } from "@db/schemas/usersSchema";
import {
  badRequestRes,
  duplicateEntry,
  fetchSuccess,
  postSuccess
} from "@helpers/httpResponseGenerator";
import generateJwtToken from "@utils/generateJwtToken";
import bcrypt from "bcryptjs";
import { and, eq, isNull, or } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { LOGIN_REQUEST, REGISTER_REQUEST } from "types/auth/reqBodyTypes";

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
        "This email is already registered. Please use another one."
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
        "This number is already in use. Please try a different one."
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
        contact_no: contactNo
      })
      .returning({ user_id: users.id });

    const userID = user[0]?.user_id;

    const accessToken = generateJwtToken({ user_id: userID }, JWT_EXPIRES_IN);

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

    const contactNo = emailOrContact!;

    const existingUser: USER[] = await db
      .select({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        contact_no: users.contact_no,
        role: roles.id,
        user_image: users.user_image,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at,
        password: users.password
      })
      .from(users)
      .innerJoin(userRoles, eq(userRoles.user_id, users.id))
      .innerJoin(roles, eq(roles.id, userRoles.role_id))
      .where(
        and(
          or(eq(users.email, emailOrContact!), eq(users.contact_no, contactNo)),
          isNull(users.deleted_at)
        )
      );

    if (!existingUser.length) {
      return badRequestRes(
        res,
        "No user was found with the provided email or contact number."
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser[0]!.password!
    );

    if (!isPasswordMatch) {
      return badRequestRes(res, "The provided credentials do not match.");
    }

    const accessToken = generateJwtToken({
      role: existingUser[0]!.role,
      user_id: existingUser[0]?.id
    });

    const { password: userPassword, ...restUser } = existingUser[0]!;

    return fetchSuccess(res, "You have successfully logged in.", {
      user: restUser,
      accessToken
    });
  } catch (error) {
    return next(error);
  }
};
