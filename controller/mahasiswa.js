const { Mahasiswa } = require("../models");
const response = require("../helper/response");
const redisConnection = require("../config/redis");

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

module.exports = {
  getAll,
  getById,
};
