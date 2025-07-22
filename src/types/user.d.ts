type USER = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_no: string;
  role: number;
  user_image: string | null;
  role: number;
  password: string;
};

type USER_WO_PASSWORD = Omit<USER, "password">;
