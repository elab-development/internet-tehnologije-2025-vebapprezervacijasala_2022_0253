import swaggerJSDoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API dokumentacija",
      version: "1.0.0",
      description: "Dokumentacija za backend API",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "auth"
        }
      }
    },
    security: [
      {
        cookieAuth: []
      }
    ]
  },
  apis: ["./src/app/api/**/*.ts"], // GDE su tvoje route.ts datoteke
};

export const swaggerSpec = swaggerJSDoc(options);
