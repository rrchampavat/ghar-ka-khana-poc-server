import { USER_ROLES } from "@constants/enums";
import { BCRYPT_SALT, JWT_EXPIRES_IN_SEC } from "@constants/envVars";
import db from "@db/connection";
import { REFRESH_TOKEN, refreshTokens } from "@db/schemas/refreshTokenSchema";
import { roles } from "@db/schemas/rolesSchema";
import { userRoles } from "@db/schemas/userRolesSchema";
import { users } from "@db/schemas/usersSchema";
import { setRefreshCookie } from "@helpers/cookie";
import {
  badRequestRes,
  conflictRes,
  duplicateEntry,
  fetchSuccess,
  notAuthorizedRes,
  postSuccess
} from "@helpers/httpResponseGenerator";
import {
  compareRefreshTokenHash,
  generateJwtToken,
  generateRefreshTokenString,
  getRefreshExpiryDate,
  hashRefreshToken
} from "@utils/jwt";
import bcrypt from "bcryptjs";
import { and, eq, or } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { LOGIN_REQUEST, REGISTER_REQUEST } from "types/auth/reqBodyTypes";
import { CUSTOM_REQUEST } from "types/extended-types";

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

    const deletedEmail = await baseQuery.where(
      and(
        or(eq(users.email, email!), eq(users.contact_no, contactNo)),
        eq(users.is_active, false)
      )
    );

    if (deletedEmail.length) {
      return conflictRes(
        res,
        "An account with this email already exists but is inactive. Please recover your account instead of registering again."
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
        password: users.password,
        is_active: users.is_active
      });

    const userID = user[0]?.id;

    if (!userID) {
      return badRequestRes(res, "Failed to create user account.");
    }

    await db.insert(userRoles).values({
      user_id: userID,
      role_id: USER_ROLES["Customer"] // Assign customer role
    });

    const accessToken = generateJwtToken(
      { user_id: userID },
      JWT_EXPIRES_IN_SEC
    );

    // Add refresh token to DB

    const refreshString = generateRefreshTokenString();
    const hashed = await hashRefreshToken(refreshString);
    const expiresAt = getRefreshExpiryDate();

    await db
      .insert(refreshTokens)
      .values({
        user_id: user?.[0]?.id,
        token_hash: hashed,
        expires_at: expiresAt,
        user_agent: req.get("user-agent") ?? null,
        ip: req.ip
      })
      .returning();

    setRefreshCookie(res, refreshString, expiresAt);

    // const insertUserQuery = sql`INSERT INTO ${users} (first_name, last_name, email, password, contact_no, role_id, user_image)
    //         VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${contactNo}, 0, ${userImage})`;
    //
    // const executableInsertQuery = generateExecutableQuery(insertUserQuery);

    // await executableInsertQuery;

    return postSuccess(
      res,
      "Congratulations! You have successfully registered.",
      { accessToken, user: { ...user[0], role: USER_ROLES["Customer"] } }
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

    // Add refresh token to DB
    const refreshString = generateRefreshTokenString();
    const hashed = await hashRefreshToken(refreshString);
    const expiresAt = getRefreshExpiryDate();

    await db
      .insert(refreshTokens)
      .values({
        user_id: activeUser?.[0]?.id,
        token_hash: hashed,
        expires_at: expiresAt,
        user_agent: req.get("user-agent") ?? null,
        ip: req.ip
      })
      .returning();

    setRefreshCookie(res, refreshString, expiresAt);

    return fetchSuccess(res, "You have successfully logged in.", {
      user: restUser,
      accessToken
    });
  } catch (error) {
    return next(error);
  }
};

export const generateRefreshToken = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
) => {
  try {
    const presentedToken = req.cookies?.refreshToken ?? req.body?.refreshToken;

    if (!presentedToken)
      return notAuthorizedRes(res, "No refresh token found.");

    const candidates = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.is_revoked, false));

    let matchedRow: REFRESH_TOKEN | null = null;

    for (const r of candidates) {
      const isOk = await compareRefreshTokenHash(presentedToken, r.token_hash);

      if (isOk) {
        matchedRow = r;
        break;
      }
    }

    if (!matchedRow) return notAuthorizedRes(res, "Invalid refresh token.");

    if (new Date(matchedRow.expires_at) < new Date())
      return notAuthorizedRes(res, "Refresh token has expired.");

    // Store matched row values to avoid TypeScript narrowing issues in async callbacks
    const matchedRowId = matchedRow.id;
    const matchedRowUserId = matchedRow.user_id;

    // rotation: create new refresh token, mark old as revoked and set replaced_by
    const newRefreshString = generateRefreshTokenString();
    const newHash = await hashRefreshToken(newRefreshString);
    const newExpiry = getRefreshExpiryDate();

    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(refreshTokens)
        .values({
          user_id: matchedRowUserId,
          token_hash: newHash,
          expires_at: newExpiry,
          user_agent: req.get("user-agent") ?? null,
          ip: req.ip
        })
        .returning();

      // revoke old and set replaced_by
      await tx
        .update(refreshTokens)
        .set({ is_revoked: true, replaced_by: inserted?.[0]?.id })
        .where(eq(refreshTokens.id, matchedRowId));
    });

    const roles = await db
      .select({
        role: userRoles.role_id
      })
      .from(userRoles)
      .where(eq(userRoles.user_id, matchedRowUserId));

    // issue new access token
    const accessToken = generateJwtToken({
      role: roles?.[0]!.role,
      user_id: matchedRowUserId
    });

    setRefreshCookie(res, newRefreshString, newExpiry);

    return fetchSuccess(res, "", { accessToken });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (
  req: CUSTOM_REQUEST,
  res: Response,
  next: NextFunction
) => {
  try {
    const presentedToken = req.cookies?.refreshToken ?? req.body?.refreshToken;

    if (!presentedToken) {
      // best-effort: clear cookie and respond OK
      res.clearCookie("refreshToken", { path: "/" });
      return res.json({ ok: true });
    }

    // find matching token and revoke it
    const candidates = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.is_revoked, false));

    for (const r of candidates) {
      const isOk = await compareRefreshTokenHash(presentedToken, r.token_hash);

      if (isOk) {
        await db
          .update(refreshTokens)
          .set({ is_revoked: true })
          .where(eq(refreshTokens.id, r.id));

        break;
      }
    }

    res.clearCookie("refreshToken", { path: "/" });
    return res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};
