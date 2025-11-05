import { CookieOptions, type Response } from "express";

export const setRefreshCookie = (
  res: Response,
  token: string,
  expiresAt: Date
) => {
  const cookieOpts: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/"
  };

  res.cookie("refreshToken", token, cookieOpts);
};
