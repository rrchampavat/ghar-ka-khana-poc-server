import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "DUKAAN API",
      version: "1.0.0",
      description: "A short description of DUKAAN API"
    }
  },
  apis: ["./src/swagger-docs/*.ts"] // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs;
