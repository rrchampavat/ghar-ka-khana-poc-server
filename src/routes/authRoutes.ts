import { registerUser } from "contollers/authController.ts";
import { Router } from "express";
import multer from "multer";
import path from "path";

const router: Router = Router();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "user-images/"); // The path to where the uploaded files will be stored
  },
  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// Initialize upload
export const upload = multer({ storage: storage });

router.post("/register", upload.single("file"), registerUser);

export default router;
