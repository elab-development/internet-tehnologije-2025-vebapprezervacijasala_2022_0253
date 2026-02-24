// tests/api/registracija.test.ts
import { POST } from "@/app/api/auth/register/route";
import { NextResponse } from "next/server";

describe("POST /api/auth/register", () => {

  it("registers a new user and returns user data", async () => {
    // generišemo unikatan email za svaki test run
    const randomEmail = `user${Date.now()}@example.com`;

    // pravimo "request" objekat koji POST handler očekuje
    const req = {
      json: async () => ({
        name: "Test User",
        email: randomEmail,
        password: "password123"
      })
    } as Request;

    const res = await POST(req);

    // status mora da bude 200
    expect(res.status).toBe(200);

    // pročitaj response JSON
    const data = await res.json();

    // proveri da li vraća očekivane podatke
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name", "Test User");
    expect(data).toHaveProperty("email", randomEmail);

    // proveri da li je cookie postavljen
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toMatch(/auth=/); // ime cookie-ja iz auth.ts (možeš zameniti sa AUTH_COOKIE)
  });

  it("returns 400 if email already exists", async () => {
    const email = `duplicate${Date.now()}@example.com`;

    // prvi unos - uspešan
    const req1 = { json: async () => ({ name: "User1", email, password: "pass123" }) } as Request;
    await POST(req1);

    // drugi unos sa istim email-om - mora da baci grešku 400
    const req2 = { json: async () => ({ name: "User2", email, password: "pass123" }) } as Request;
    const res2 = await POST(req2);

    expect(res2.status).toBe(400);
    const data2 = await res2.json();
    expect(data2).toHaveProperty("error", "Email vec postoji");
  });

  it("returns 401 if missing data", async () => {
    const req = { json: async () => ({ name: "", email: "", password: "" }) } as Request;
    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty("error", "Nedostaju podaci");
  });

});