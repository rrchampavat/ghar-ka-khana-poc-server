import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const ourFileRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
  profilePicture: f(["image"])
    .middleware(() => ({}))
    .onUploadComplete((_data) => ({}))
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// export const uploadUserImage = async (
//   _req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const files = await utapi.listFiles({});

//     console.log({ files });

//     return postSuccess(
//       res,
//       "The profile image has been successfully uploaded."
//     );
//   } catch (error) {
//     return next(error);
//   }
// };
