const { Buku, RakBuku, Sequelize } = require("../models");
const response = require("../helper/response");
const redisConnection = require("../config/redis");

const getAll = async (req, res) => {
  try {
    const {
      judul_buku,
      nama_penulis,
      nama_penerbit,
      tahun_penerbit,
      nama_rak_buku,
    } = req.query;

    const where = {};
    const whereRakBuku = {};

    if (judul_buku) {
      where.judul_buku = { [Sequelize.Op.like]: `%${judul_buku}%` };
    }
    if (nama_penulis) {
      where.nama_penulis = { [Sequelize.Op.like]: `%${nama_penulis}%` };
    }
    if (nama_penerbit) {
      where.nama_penerbit = { [Sequelize.Op.like]: `%${nama_penerbit}%` };
    }
    if (tahun_penerbit) {
      where.tahun_penerbit = { [Sequelize.Op.like]: `%${tahun_penerbit}%` };
    }
    if (nama_rak_buku) {
      whereRakBuku.nama = {
        [Sequelize.Op.like]: `%${nama_rak_buku}%`,
      };
    }

    const getAllDataBuku = await Buku.findAll({
      where,
      include: {
        model: RakBuku,
        as: "rak_buku",
        attributes: ["nama"],
        where: whereRakBuku,
      },
      attributes: [
        "id",
        "judul_buku",
        "nama_penulis",
        "nama_penerbit",
        "tahun_penerbit",
        "stok",
      ],
    });
    if (getAllDataBuku.length > 0) {
      // set getBuku redis
      await redisConnection.setEx(
        `getBuku:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify(getAllDataBuku)
      );
    }
    return response(res, {
      status: "success",
      data: getAllDataBuku,
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
