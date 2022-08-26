const { Mahasiswa, Denda, Peminjaman, sequelize } = require("../models");
const response = require("../helper/response");
const redisConnection = require("../config/redis");
const { deleteKeys } = require("../helper/redis");

const attributes = ["id", "jurusan", "no_telp", "alamat", "nama_lengkap"];
const getAll = async (req, res) => {
  try {
    const getAllMahasiswa = await Mahasiswa.findAll({
      attributes,
    });
    if (getAllMahasiswa.length > 0) {
      // set getMahasiswa: redis
      await redisConnection.setEx(
        "getMahasiswa:",
        60 * 60 * 24 * 7, // 7 hari
        JSON.stringify(getAllMahasiswa)
      );
    }
    return response(res, {
      status: "success",
      data: getAllMahasiswa,
    });
  } catch (error) {
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      500
    );
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    // ambil data di redis jika ada
    const getMahasiswaRedis = await redisConnection.get("getMahasiswa:");
    if (getMahasiswaRedis !== null) {
      const resultArray = JSON.parse(getMahasiswaRedis);
      const getMahasiswaById = resultArray.find((data) => data.id === id);
      if (getMahasiswaById) {
        return response(res, {
          status: "success",
          data: getMahasiswaById,
        });
      } else {
        throw {
          message: "Data mahasiswa tidak ada!",
          statusCode: 404,
        };
      }
    }
    const getMahasiswaById = await Mahasiswa.findByPk(id, {
      attributes,
    });
    if (!getMahasiswaById) {
      throw {
        message: "Data mahasiswa tidak ada!",
        statusCode: 404,
      };
    }
    return response(res, {
      status: "success",
      data: getMahasiswaById,
    });
  } catch (error) {
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      error.statusCode || 500
    );
  }
};

const create = async (req, res) => {
  try {
    const { jurusan, no_telp, alamat, nama_lengkap } = req.body;
    const findCreateMahasiswa = await Mahasiswa.findOrCreate({
      where: { no_telp },
      defaults: {
        jurusan,
        no_telp,
        alamat,
        nama_lengkap,
      },
    });
    // cek unique no telp mahasiswa
    if (!findCreateMahasiswa[1]) {
      throw {
        message: "nomor telpon mahasiswa sudah ada!",
        statusCode: 400,
      };
    }
    // hapus data di redis
    await deleteKeys("getMahasiswa:");
    return response(
      res,
      {
        status: "success",
        message: "Data mahasiswa berhasil ditambahkan!",
      },
      201
    );
  } catch (error) {
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      error.statusCode || 500
    );
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { jurusan, no_telp, alamat, nama_lengkap } = req.body;
    if (no_telp) {
      // cek unique no telp mahasiswa
      const findMahasiswaByNoTelp = await Mahasiswa.findOne({
        where: { no_telp },
      });
      if (findMahasiswaByNoTelp) {
        throw {
          message: "nomor telpon mahasiswa sudah ada!",
          statusCode: 400,
        };
      }
    }
    const [isUpdateMahasiswa] = await Mahasiswa.update(
      { jurusan, no_telp, alamat, nama_lengkap },
      {
        where: { id },
      }
    );
    if (!isUpdateMahasiswa) {
      throw {
        message: "Data mahasiswa tidak ada!",
        statusCode: 404,
      };
    }
    // hapus data di redis
    await deleteKeys("getMahasiswa:");
    return response(
      res,
      {
        status: "success",
        message: "Data mahasiswa berhasil diupdate!",
      },
      200
    );
  } catch (error) {
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      error.statusCode || 500
    );
  }
};

const destroy = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const isDeleteMahasiswa = await Mahasiswa.destroy({
      where: { id },
      transaction,
    });
    if (!isDeleteMahasiswa) {
      throw {
        message: "Data mahasiswa tidak ada!",
        statusCode: 404,
      };
    }
    // hapus data peminjaman | denda | redis
    await Promise.all([
      Peminjaman.destroy({ where: { id_mahasiswa: id }, transaction }),
      Denda.destroy({ where: { id_mahasiswa: id }, transaction }),
      deleteKeys("getMahasiswa:"),
    ]);
    transaction.commit();
    return response(res, {
      status: "success",
      message: "Data mahasiswa berhasil dihapus!",
    });
  } catch (error) {
    await transaction.rollback();
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      error.statusCode || 500
    );
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  destroy,
};
