const { Mahasiswa } = require("../models");
const response = require("../helper/response");
const redisConnection = require("../config/redis");

const getAll = async (req, res) => {
  try {
    const getAllMahasiswa = await Mahasiswa.findAll({
      attributes: ["id", "jurusan", "no_telp", "alamat", "nama_lengkap"],
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

module.exports = {
  getAll,
};
