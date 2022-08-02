const request = require("supertest");
const app = require("../app");
const uuidv4 = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

describe("POST /denda", () => {
  it("should create denda success with status = hilang", async () => {
    // ambil id mahasiswa dan id buku
    // get buku untuk ambil id
    const getBuku = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_buku } = getBuku.body.data[0];

    // get mahasiswa untuk ambil id
    const getMahasiswa = await request(app)
      .get("/mahasiswa")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_mahasiswa } = getMahasiswa.body.data[0];

    const createDenda = await request(app)
      .post("/denda")
      .set("Accept", "application/json")
      .send({ id_buku, id_mahasiswa, status: "hilang" })
      .expect(200);

    expect(createDenda.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data denda berhasil dibuat!",
      })
    );
  });

  it("should create denda success with status = rusak", async () => {
    // ambil id mahasiswa dan id buku
    // get buku untuk ambil id
    const getBuku = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_buku } = getBuku.body.data[0];

    // get mahasiswa untuk ambil id
    const getMahasiswa = await request(app)
      .get("/mahasiswa")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_mahasiswa } = getMahasiswa.body.data[0];

    const createDenda = await request(app)
      .post("/denda")
      .set("Accept", "application/json")
      .send({ id_buku, id_mahasiswa, status: "rusak" })
      .expect(200);

    expect(createDenda.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data denda berhasil dibuat!",
      })
    );
  });

  it("should create denda failed invalid validation", async () => {
    await request(app)
      .post("/denda")
      .set("Accept", "application/json")
      .expect(400);
  });

  it("should create denda failed buku not found", async () => {
    const createDenda = await request(app)
      .post("/denda")
      .set("Accept", "application/json")
      .send({ id_buku: uuidv4, id_mahasiswa: uuidv4, status: "hilang" })
      .expect(404);

    expect(createDenda.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data buku tidak ada!",
      })
    );
  });

  it("should create denda failed mahasiswa not found", async () => {
    // get buku untuk ambil id
    const getBuku = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_buku } = getBuku.body.data[0];

    const createDenda = await request(app)
      .post("/denda")
      .set("Accept", "application/json")
      .send({ id_buku, id_mahasiswa: uuidv4, status: "hilang" })
      .expect(404);

    expect(createDenda.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data mahasiswa tidak ada!",
      })
    );
  });
});

describe("GET /denda", () => {
  it("should get all denda success", async () => {
    const getAllDenda = await request(app)
      .get("/denda")
      .set("Accept", "application/json")
      .expect(200);

    expect(getAllDenda.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: getAllDenda.body.data,
      })
    );
  });
});
