import { ourFileRouter } from "@controllers/imageController";
import { Router } from "express";
import { createUploadthingExpressHandler } from "uploadthing/express";

const router = Router();

router.post(
  "/profile-picture",
  createUploadthingExpressHandler({
    router: ourFileRouter
  })
);

export default router;
