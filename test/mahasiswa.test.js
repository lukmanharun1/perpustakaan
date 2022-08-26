const request = require("supertest");
const app = require("../app");
const uuidv4 = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";
const redisConnection = require("../config/redis");

const data = {
  jurusan: "Rekayasa Perangkat Lunak",
  no_telp: `0896391898${Math.round(Math.random() * 99)}`,
  alamat: "Jalan Pegangsaan Timur No. 56, Jakarta Pusat",
  nama_lengkap: "Lukman Harun",
};

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

describe("POST /mahasiswa", () => {
  it("should create mahasiswa success", async () => {
    const response = await request(app)
      .post("/mahasiswa")
      .set("Accept", "application/json")
      .send(data)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data mahasiswa berhasil ditambahkan!",
      })
    );
  });

  it("should create mahasiswa failed nomor telpon already exists", async () => {
    const response = await request(app)
      .post("/mahasiswa")
      .set("Accept", "application/json")
      .send(data)
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "nomor telpon mahasiswa sudah ada!",
      })
    );
  });

  it("should create mahasiswa by id failed invalid validation", async () => {
    await request(app)
      .post("/mahasiswa")
      .set("Accept", "application/json")
      .expect(400);
  });
});

describe("PUT /mahasiswa/:id", () => {
  const dataUpdate = {
    jurusan: "Update teknik informasi",
    no_telp: `0896391898${Math.round(Math.random() * 99)}`,
    alamat: `update Jalan Pegangsaan Timur No.${Math.round(
      Math.random() * 99
    )} , Jakarta Pusat`,
    nama_lengkap: `update nama ke ${Math.round(Math.random() * 99)}`,
  };
  it("should update mahasiswa success", async () => {
    const getAllMahasiswa = await request(app)
      .get("/mahasiswa")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = getAllMahasiswa.body.data[0];

    // update mahasiswa
    const updateMahasiswa = await request(app)
      .put(`/mahasiswa/${id}`)
      .set("Accept", "application/json")
      .send(dataUpdate)
      .expect(200);

    expect(updateMahasiswa.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data mahasiswa berhasil diupdate!",
      })
    );

    // cek untuk memasikan data sudah ke update

    const findMahasiswaById = await request(app)
      .get(`/mahasiswa/${id}`)
      .set("Accept", "application/json")
      .expect(200);

    expect(findMahasiswaById.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: { ...dataUpdate, id },
      })
    );
  });

  it("should update mahasiswa failed no telp already exists", async () => {
    const getAllMahasiswa = await request(app)
      .get("/mahasiswa")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = getAllMahasiswa.body.data[0];

    // update mahasiswa failed
    const updateMahasiswa = await request(app)
      .put(`/mahasiswa/${id}`)
      .set("Accept", "application/json")
      .send(dataUpdate)
      .expect(400);

    expect(updateMahasiswa.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "nomor telpon mahasiswa sudah ada!",
      })
    );
  });

  it("should update mahasiswa by id not found", async () => {
    // update mahasiswa failed
    const updateMahasiswa = await request(app)
      .put(`/mahasiswa/${uuidv4}`)
      .set("Accept", "application/json")
      .send({
        ...dataUpdate,
        no_telp: `0896391899${Math.round(Math.random() * 99)}`,
      })
      .expect(404);

    expect(updateMahasiswa.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data mahasiswa tidak ada!",
      })
    );
  });

  it("should update mahasiswa by id failed invalid validation", async () => {
    await request(app)
      .put("/mahasiswa/:id")
      .set("Accept", "application/json")
      .expect(400);
  });
});

describe("DELETE /mahasiswa/:id", () => {
  it("should delete mahasiswa success", async () => {
    const getAllMahasiswa = await request(app)
      .get("/mahasiswa")
      .set("Accept", "application/json")
      .expect(200);

    const { id } = getAllMahasiswa.body.data[0];

    const deleteMahasiswa = await request(app)
      .delete(`/mahasiswa/${id}`)
      .set("Accept", "application/json")
      .expect(200);

    expect(deleteMahasiswa.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Data mahasiswa berhasil dihapus!",
      })
    );
  });

  it("should delete mahasiswa by id not found", async () => {
    // update mahasiswa failed
    const updateMahasiswa = await request(app)
      .delete(`/mahasiswa/${uuidv4}`)
      .set("Accept", "application/json")
      .expect(404);

    expect(updateMahasiswa.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Data mahasiswa tidak ada!",
      })
    );
  });

  it("should delete mahasiswa by id failed invalid validation", async () => {
    await request(app)
      .delete("/mahasiswa/:id")
      .set("Accept", "application/json")
      .expect(400);
  });
});
