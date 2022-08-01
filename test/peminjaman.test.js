const request = require("supertest");
const app = require("../app");
const uuidv4 = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";
const { Peminjaman } = require("../models");

// buat tanggal pengembalian = tanggal sekarang + 2 hari
const tanggal_sekarang = new Date().getDate();
const tanggal_pengembalian = new Date(new Date().setDate(tanggal_sekarang + 2))
  .toISOString()
  .split("T")[0]; // format YYYY-MM-DD

describe("POST /peminjaman", () => {
  it("should create peminjaman success", async () => {
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
    const data = { id_buku, id_mahasiswa, tanggal_pengembalian };
    const response = await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data peminjaman berhasil ditambahkan!",
      })
    );
    // delete data peminjaman
    await Peminjaman.destroy({
      where: data,
    });
  });

  it("should create peminjaman failed invalid validation", async () => {
    await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .expect(400);
  });

  it("should create peminjaman failed buku not found", async () => {
    const response = await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send({ tanggal_pengembalian, id_buku: uuidv4, id_mahasiswa: uuidv4 })
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data buku tidak ada!",
      })
    );
  });

  it("should create peminjaman failed mahasiswa not found", async () => {
    // get buku untuk ambil id
    const getBuku = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_buku } = getBuku.body.data[0];

    const response = await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send({ tanggal_pengembalian, id_buku, id_mahasiswa: uuidv4 })
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data mahasiswa tidak ada!",
      })
    );
  });

  it("should create peminjaman dulicate failed", async () => {
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
    const data = { id_buku, id_mahasiswa, tanggal_pengembalian };
    const createPeminjaman1 = await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    expect(createPeminjaman1.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data peminjaman berhasil ditambahkan!",
      })
    );
    // send peminjaman lagi
    const createPeminjaman2 = await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(400);

    expect(createPeminjaman2.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Tidak boleh meminjam buku yang sama!",
      })
    );
    // delete data peminjaman
    await Peminjaman.destroy({
      where: data,
    });
  });
});

describe("GET /peminjaman", () => {
  it("should get all peminjaman success", async () => {
    const response = await request(app)
      .get("/peminjaman")
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: response.body.data,
      })
    );
  });
});
