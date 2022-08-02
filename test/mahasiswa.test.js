const request = require("supertest");
const app = require("../app");
const uuidv4 = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";
const redisConnection = require("../config/redis");

describe("GET /mahasiswa", () => {
  it("should get all mahasiswa success", async () => {
    const response = await request(app)
      .get("/mahasiswa")
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: response.body.data,
      })
    );

    // pastikan data ada diredis
    const getMahasiswaRedis = await redisConnection.get("getMahasiswa:");
    expect(getMahasiswaRedis).toEqual(JSON.stringify(response.body.data));
  });
});

describe("GET /mahasiswa/:id", () => {
  it("should get mahasiswa by id success", async () => {
    const getAllMahasiswa = await request(app)
      .get("/mahasiswa")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = getAllMahasiswa.body.data[0];

    const response = await request(app)
      .get(`/mahasiswa/${id}`)
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: getAllMahasiswa.body.data[0],
      })
    );
  });

  it("should get mahasiswa by id failed invalid validation", async () => {
    await request(app)
      .get("/mahasiswa/:id")
      .set("Accept", "application/json")
      .expect(400);
  });

  it("should get mahasiswa by id not found", async () => {
    const response = await request(app)
      .get(`/mahasiswa/${uuidv4}`)
      .set("Accept", "application/json")
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data mahasiswa tidak ada!",
      })
    );
  });
});
