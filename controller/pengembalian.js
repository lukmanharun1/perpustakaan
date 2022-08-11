const { Peminjaman, Denda, Buku, sequelize, Sequelize } = require("../models");
const countDiffDays = require("../helper/countDiffDays");
const response = require("../helper/response");

const create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let { tanggal_pengembalian, id_peminjaman, status, nominal = 0 } = req.body;
    let isDenda = false;
    // cari id peminjaman
    const findPeminjamanById = await Peminjaman.findByPk(id_peminjaman, {
      transaction,
    });
    if (!findPeminjamanById) {
      throw {
        message: "Data peminjaman tidak ada!",
        statusCode: 404,
      };
    }
    const {
      tanggal_peminjaman,
      id_buku,
      id_mahasiswa,
      tanggal_pengembalian: tanggal_jatuh_tempo,
    } = findPeminjamanById;
    if (status) {
      // create denda
      isDenda = true;
    }
    if (tanggal_pengembalian > findPeminjamanById.tanggal_pengembalian) {
      // status terlambat | create denda
      isDenda = true;
      if (status) {
        status = `${status} dan terlambat`;
      } else {
        status = "terlambat";
      }
    }
    if (isDenda) {
      // create denda
      // hitung jumlah nominal denda 1 hari = 1000
      nominal =
        countDiffDays(
          tanggal_pengembalian,
          findPeminjamanById.tanggal_pengembalian
        ) *
          1000 +
        nominal;
      const createDenda = await Denda.create(
        {
          tanggal_peminjaman,
          id_buku,
          id_mahasiswa,
          tanggal_jatuh_tempo,
          status,
          tanggal_pengembalian,
          nominal,
        },
        { transaction }
      );
      if (!createDenda) {
        throw new Error("Data denda gagal dibuat!");
      }
    }
    if (status === "terlambat" || !status) {
      // update stok buku | tambah stok buku + 1
      const updateStokBuku = await sequelize.query(
        `UPDATE buku SET stok = stok + 1 WHERE id = '${id_buku}'`,
        {
          model: Buku,
          type: Sequelize.QueryTypes.UPDATE,
          transaction,
        }
      );
      if (!updateStokBuku) {
        throw new Error("Data stok buku gagal diupdate!");
      }
    }
    // hapus data peminjaman
    const deletePeminjaman = await findPeminjamanById.destroy({ transaction });
    if (!deletePeminjaman) {
      throw new Error("Data peminjaman gagal dihapus!");
    }
    // commit transaction
    await transaction.commit();
    return response(res, {
      status: "success",
      message: `Data pengembalian berhasil diproses!`,
      status_denda: status,
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
  create,
};
