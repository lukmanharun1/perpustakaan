const request = require("supertest");
const app = require("../app");
const uuidv4 = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";
// buat tanggal pengembalian = tanggal sekarang + 2 hari
const tanggal_sekarang = new Date().getDate();
const tanggal_pengembalian = new Date(new Date().setDate(tanggal_sekarang + 2))
  .toISOString()
  .split("T")[0]; // format YYYY-MM-DD
const tanggal_pengembalian_terlambat = new Date(
  new Date().setDate(tanggal_sekarang + 3)
)
  .toISOString()
  .split("T")[0]; // format YYYY-MM-DD

describe("POST /pengembalian", () => {
  it("should create pengembalian success", async () => {
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

    // create peminjaman terlebih dahulu
    const { id: id_mahasiswa } = getMahasiswa.body.data[0];
    const data = { id_buku, id_mahasiswa, tanggal_pengembalian };
    await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    const getPeminjaman = await request(app)
      .get("/peminjaman")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_peminjaman } = getPeminjaman.body.data[0];

    const createPengembalian = await request(app)
      .post("/pengembalian")
      .set("Accept", "application/json")
      .send({ tanggal_pengembalian, id_peminjaman })
      .expect(200);

    expect(createPengembalian.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data pengembalian berhasil diproses!",
      })
    );
  });

  it("should create pengembalian failed invalid validation", async () => {
    await request(app)
      .post("/pengembalian")
      .set("Accept", "application/json")
      .expect(400);
  });

  it("should create pengembalian failed peminjaman not found", async () => {
    const response = await request(app)
      .post("/pengembalian")
      .set("Accept", "application/json")
      .send({ tanggal_pengembalian, id_peminjaman: uuidv4 })
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data peminjaman tidak ada!",
      })
    );
  });

  it("should create pengembalian success with status = rusak", async () => {
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

    // create peminjaman terlebih dahulu
    const { id: id_mahasiswa } = getMahasiswa.body.data[0];
    const data = { id_buku, id_mahasiswa, tanggal_pengembalian };
    await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    const getPeminjaman = await request(app)
      .get("/peminjaman")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_peminjaman } = getPeminjaman.body.data[0];

    const createPengembalian = await request(app)
      .post("/pengembalian")
      .set("Accept", "application/json")
      .send({
        tanggal_pengembalian,
        id_peminjaman,
        status: "rusak",
        nominal: 10000,
      })
      .expect(200);

    expect(createPengembalian.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data pengembalian berhasil diproses!",
        status_denda: "rusak",
      })
    );
  });

  it("should create pengembalian success with status = hilang", async () => {
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

    // create peminjaman terlebih dahulu
    const { id: id_mahasiswa } = getMahasiswa.body.data[0];
    const data = { id_buku, id_mahasiswa, tanggal_pengembalian };
    await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    const getPeminjaman = await request(app)
      .get("/peminjaman")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_peminjaman } = getPeminjaman.body.data[0];

    const createPengembalian = await request(app)
      .post("/pengembalian")
      .set("Accept", "application/json")
      .send({
        tanggal_pengembalian,
        id_peminjaman,
        status: "hilang",
        nominal: 12000,
      })
      .expect(200);

    expect(createPengembalian.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data pengembalian berhasil diproses!",
        status_denda: "hilang",
      })
    );
  });

  it("should create pengembalian success with tanggal_pengembalian terlambat", async () => {
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

    // create peminjaman terlebih dahulu
    const { id: id_mahasiswa } = getMahasiswa.body.data[0];
    const data = { id_buku, id_mahasiswa, tanggal_pengembalian };
    await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    const getPeminjaman = await request(app)
      .get("/peminjaman")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_peminjaman } = getPeminjaman.body.data[0];

    const createPengembalian = await request(app)
      .post("/pengembalian")
      .set("Accept", "application/json")
      .send({
        tanggal_pengembalian: tanggal_pengembalian_terlambat,
        id_peminjaman,
      })
      .expect(200);

    expect(createPengembalian.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data pengembalian berhasil diproses!",
        status_denda: "terlambat",
      })
    );
  });

  it("should create pengembalian success with tanggal_pengembalian terlambat and status = rusak", async () => {
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

    // create peminjaman terlebih dahulu
    const { id: id_mahasiswa } = getMahasiswa.body.data[0];
    const data = { id_buku, id_mahasiswa, tanggal_pengembalian };
    await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    const getPeminjaman = await request(app)
      .get("/peminjaman")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_peminjaman } = getPeminjaman.body.data[0];

    const createPengembalian = await request(app)
      .post("/pengembalian")
      .set("Accept", "application/json")
      .send({
        tanggal_pengembalian: tanggal_pengembalian_terlambat,
        id_peminjaman,
        status: "rusak",
        nominal: 6000,
      })
      .expect(200);

    expect(createPengembalian.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data pengembalian berhasil diproses!",
        status_denda: "rusak dan terlambat",
      })
    );
  });

  it("should create pengembalian success with tanggal_pengembalian terlambat and status = rusak", async () => {
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

    // create peminjaman terlebih dahulu
    const { id: id_mahasiswa } = getMahasiswa.body.data[0];
    const data = { id_buku, id_mahasiswa, tanggal_pengembalian };
    await request(app)
      .post("/peminjaman")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    const getPeminjaman = await request(app)
      .get("/peminjaman")
      .set("Accept", "application/json")
      .expect(200);

    const { id: id_peminjaman } = getPeminjaman.body.data[0];

    const createPengembalian = await request(app)
      .post("/pengembalian")
      .set("Accept", "application/json")
      .send({
        tanggal_pengembalian: tanggal_pengembalian_terlambat,
        id_peminjaman,
        status: "hilang",
        nominal: 7000,
      })
      .expect(200);

    expect(createPengembalian.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data pengembalian berhasil diproses!",
        status_denda: "hilang dan terlambat",
      })
    );
  });
});
