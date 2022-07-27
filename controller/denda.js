const { Denda, sequelize, Sequelize, Buku, Mahasiswa } = require("../models");
const response = require("../helper/response");

const create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id_buku, id_mahasiswa, status } = req.body;
    // create data denda
    const createDenda = await Denda.create(
      {
        id_buku,
        id_mahasiswa,
        status,
      },
      { transaction }
    );
    if (!createDenda) {
      throw new Error("Data denda gagal dibuat!");
    }
    // update stok buku | kurangi stok buku - 1
    const updateStokBuku = await sequelize.query(
      `UPDATE buku SET stok = stok - 1 WHERE id = '${id_buku}'`,
      {
        model: Buku,
        type: Sequelize.QueryTypes.UPDATE,
        transaction,
      }
    );
    if (!updateStokBuku) {
      throw new Error("Data stok buku gagal diupdate!");
    }
    await transaction.commit();
    return response(res, {
      status: "success",
      message: "Data denda berhasil dibuat!",
    });
  } catch (error) {
    await transaction.rollback();
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

const getAll = async (req, res) => {
  try {
    const getDenda = await Denda.findAll({
      include: [
        {
          model: Buku,
          as: "buku",
          attributes: [
            "judul_buku",
            "nama_penulis",
            "nama_penerbit",
            "tahun_penerbit",
            "stok",
          ],
        },
        {
          model: Mahasiswa,
          as: "mahasiswa",
          attributes: ["jurusan", "no_telp", "alamat", "nama_lengkap"],
        },
      ],
      attributes: [
        "id",
        "tanggal_peminjaman",
        "tanggal_pengembalian",
        "tanggal_jatuh_tempo",
        "status",
        "id_buku",
        "id_mahasiswa",
      ],
    });
    return response(res, {
      status: "success",
      data: getDenda,
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
  create,
  getAll,
};
