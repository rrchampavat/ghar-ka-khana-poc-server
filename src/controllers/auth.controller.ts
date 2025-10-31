import { BCRYPT_SALT } from "@constants/envVars";
import { JWT_EXPIRES_IN } from "@constants/jwt";
import db from "@db/connection";
import { roles } from "@db/schemas/rolesSchema";
import { userRoles } from "@db/schemas/userRolesSchema";
import { users } from "@db/schemas/usersSchema";
import {
  badRequestRes,
  conflictRes,
  duplicateEntry,
  fetchSuccess,
  postSuccess
} from "@helpers/httpResponseGenerator";
import generateJwtToken from "@utils/generateJwtToken";
import bcrypt from "bcryptjs";
import { and, eq, or } from "drizzle-orm";
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

    const baseQuery = db.select({ email: users.email }).from(users);

    const existingEmail = await baseQuery.where(
      and(eq(users.email, email), eq(users.is_active, true))
    );

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
      .where(and(eq(users.contact_no, contactNo), eq(users.is_active, true)));

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

    const deletedEmail = await baseQuery.where(
      and(
        or(eq(users.email, email!), eq(users.contact_no, contactNo)),
        eq(users.is_active, true)
      )
    );

    if (deletedEmail.length) {
      return conflictRes(
        res,
        "An account with this email already exists but is inactive. Please recover your account instead of registering again."
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
      .returning({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        contact_no: users.contact_no,
        user_image: users.user_image,
        created_at: users.created_at,
        updated_at: users.updated_at,
        // deleted_at: users.deleted_at,
        password: users.password,
        is_active: users.is_active
      });

    const userID = user[0]?.id;

    if (!userID) {
      return badRequestRes(res, "Failed to create user account.");
    }

    await db.insert(userRoles).values({
      user_id: userID,
      role_id: 4 // Assign customer role
    });

    const accessToken = generateJwtToken({ user_id: userID }, JWT_EXPIRES_IN);

    // const insertUserQuery = sql`INSERT INTO ${users} (first_name, last_name, email, password, contact_no, role_id, user_image)
    //         VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${contactNo}, 0, ${userImage})`;
    //
    // const executableInsertQuery = generateExecutableQuery(insertUserQuery);

    // await executableInsertQuery;

    return postSuccess(
      res,
      "Congratulations! You have successfully registered.",
      { accessToken, user: { ...user[0], role: 4 } }
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

    const baseQuery = db
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
        // deleted_at: users.deleted_at,
        password: users.password,
        is_active: users.is_active
      })
      .from(users)
      .innerJoin(userRoles, eq(userRoles.user_id, users.id))
      .innerJoin(roles, eq(roles.id, userRoles.role_id));

    const existingUser: USER[] = await baseQuery.where(
      or(eq(users.email, emailOrContact!), eq(users.contact_no, contactNo))
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

    const activeUser: USER[] = await baseQuery.where(
      and(
        or(eq(users.email, emailOrContact!), eq(users.contact_no, contactNo)),
        eq(users.is_active, true)
      )
    );

    if (!activeUser.length) {
      return badRequestRes(
        res,
        "This account has been deactivated. Please contact support to restore access."
      );
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
