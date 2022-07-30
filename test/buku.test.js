const request = require("supertest");
const app = require("../app");
const redisConnection = require("../config/redis");

const data = {
  judul_buku: `Membuat unit test dengan jest cetakan ke-${Math.round(
    Math.random() * 1000
  )}`,
  nama_penulis: "Lukman Harun",
  nama_penerbit: "Gramedia",
  tahun_penerbit: new Date().getFullYear(),
  nama_rak_buku: "001 finansial",
  stok: 100,
};
const uuidv4 = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

describe("GET /buku", () => {
  it("should get buku success", async () => {
    const response = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: response.body.data,
      })
    );
    // pastikan data sudah cache di redis
    const getBukuRedis = await redisConnection.get("getBuku:{}");
    expect(getBukuRedis).toEqual(JSON.stringify(response.body.data));
  });
  it("should get buku with query params", async () => {
    const dataQuery = {
      judul_buku: "Compound Interest",
      nama_penulis: "Lukman Harun",
      nama_penerbit: "Erlangga",
      tahun_penerbit: "2022",
      nama_rak_buku: "001 finansial",
    };
    const {
      judul_buku,
      nama_penulis,
      nama_penerbit,
      tahun_penerbit,
      nama_rak_buku,
    } = dataQuery;

    const response = await request(app)
      .get("/buku")
      .query(dataQuery)
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: expect.arrayContaining([
          expect.objectContaining({
            judul_buku,
            nama_penulis,
            nama_penerbit,
            tahun_penerbit,
            rak_buku: {
              nama: nama_rak_buku,
            },
          }),
        ]),
      })
    );
    // pastikan data sudah cache di redis
    const getBukuRedis = await redisConnection.get(
      `getBuku:${JSON.stringify(dataQuery)}`
    );
    expect(getBukuRedis).toEqual(JSON.stringify(response.body.data));
  });
});

describe("POST /buku", () => {
  it("should create buku success", async () => {
    const response = await request(app)
      .post("/buku")
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data buku berhasil ditambahkan!",
      })
    );

    // pastikan data sudah dihapus didalam redis
    const getBukuRedis = await redisConnection.get("getBuku:*");
    expect(getBukuRedis).toBe(null);
  });

  it("should create buku duplicate failed", async () => {
    const response = await request(app)
      .post("/buku")
      .set("Accept", "application/json")
      .send(data)
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data buku sudah ada!",
      })
    );
  });

  it("should create buku failed invalid validation", async () => {
    await request(app)
      .post("/buku")
      .set("Accept", "application/json")
      .expect(400);
  });
});

describe("PUT /buku", () => {
  it("should update buku success", async () => {
    // get buku untuk ambil id
    const response = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = response.body.data[0];

    delete data.nama_rak_buku;
    const updateBuku = await request(app)
      .put(`/buku/${id}`)
      .set("Accept", "application/json")
      .send(data)
      .expect(200);

    expect(updateBuku.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data buku berhasil diupdate!",
      })
    );
  });

  it("should update buku failed invalid validation", async () => {
    await request(app)
      .put("/buku/:id")
      .set("Accept", "application/json")
      .expect(400);
  });
});

describe("GET /buku/:id", () => {
  it("should get find buku by id success", async () => {
    // get buku untuk ambil id
    const response = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = response.body.data[0];

    const findBukuById = await request(app)
      .get(`/buku/${id}`)
      .set("Accept", "application/json")
      .expect(200);

    expect(findBukuById.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: response.body.data[0],
      })
    );
  });

  it("should find buku by id failed invalid validation", async () => {
    await request(app)
      .get("/buku/:id")
      .set("Accept", "application/json")
      .expect(400);
  });

  it("should find buku by id not found ", async () => {
    const response = await request(app)
      .get(`/buku/${uuidv4}`)
      .set("Accept", "application/json")
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data buku tidak ada!",
      })
    );
  });
});

describe("PATCH /buku/:id", () => {
  it("should update nama rak buku with buku success", async () => {
    // get buku untuk ambil id
    const response = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = response.body.data[0];

    const updateNamaRakBuku = await request(app)
      .patch(`/buku/${id}`)
      .set("Accept", "application/json")
      .send({ nama_rak_buku: "001 finansial" })
      .expect(200);

    expect(updateNamaRakBuku.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Nama rak buku berhasil diupdate!",
      })
    );
  });

  it("should update nama rak buku with buku failed invalid validation", async () => {
    await request(app)
      .patch("/buku/:id")
      .set("Accept", "application/json")
      .expect(400);
  });

  it("should update nama rak buku with buku not found", async () => {
    const response = await request(app)
      .patch(`/buku/${uuidv4}`)
      .set("Accept", "application/json")
      .send({ nama_rak_buku: "001 finansial" })
      .expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data buku tidak ada!",
      })
    );
  });

  it("should update nama rak buku not found with buku", async () => {
    // get buku untuk ambil id
    const response = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = response.body.data[0];
    const updateNamaRakBuku = await request(app)
      .patch(`/buku/${id}`)
      .set("Accept", "application/json")
      .send({ nama_rak_buku: "tidak ada" })
      .expect(404);

    expect(updateNamaRakBuku.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Nama rak buku tidak ada!",
      })
    );
  });
});

describe("DELETE /buku/:id", () => {
  it("should delete buku success", async () => {
    // get buku untuk ambil id
    const response = await request(app)
      .get("/buku")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = response.body.data[0];

    const deleteBuku = await request(app)
      .delete(`/buku/${id}`)
      .set("Accept", "application/json")
      .expect(200);

    expect(deleteBuku.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data buku berhasil dihapus!",
      })
    );
  });

  it("should delete buku failed invalid validation", async () => {
    await request(app)
      .delete("/buku/:id")
      .set("Accept", "application/json")
      .expect(400);
  });

  it("should delete buku not found", async () => {
    const deleteBuku = await request(app)
      .delete(`/buku/${uuidv4}`)
      .set("Accept", "application/json")
      .expect(404);

    expect(deleteBuku.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data buku tidak ada!",
      })
    );
  });
});
