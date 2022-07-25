const {
  Buku,
  Mahasiswa,
  Peminjaman,
  Sequelize,
  sequelize,
} = require("../models");
const response = require("../helper/response");

const create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { tanggal_pengembalian, id_buku, id_mahasiswa } = req.body;
    // cari id buku
    const findBukuById = await Buku.findOne({
      where: {
        id: id_buku,
        stok: {
          [Sequelize.Op.gt]: 0,
        },
      },
      attributes: ["id", "stok"],
      transaction,
    });
    if (!findBukuById) {
      return response(
        res,
        {
          status: "error",
          message: "Data buku tidak ada!",
        },
        404
      );
    }
    // cari id mahasiswa
    const findMahasiswaById = await Mahasiswa.findOne({
      where: {
        id: id_mahasiswa,
      },
      attributes: ["id"],
      transaction,
    });
    if (!findMahasiswaById) {
      return response(
        res,
        {
          status: "error",
          message: "Data mahasiswa tidak ada!",
        },
        404
      );
    }
    // tambah data peminjaman dan tidak boleh meminjam buku yang sama
    const createPeminjaman = await Peminjaman.findOrCreate({
      where: {
        id_buku,
        id_mahasiswa,
      },
      defaults: {
        tanggal_pengembalian,
        id_buku,
        id_mahasiswa,
      },
      transaction,
    });
    if (!createPeminjaman[1]) {
      return response(
        res,
        {
          status: "error",
          message: "Tidak boleh meminjam buku yang sama!",
        },
        400
      );
    }
    // update stok buku | kurangi stok buku - 1
    findBukuById.stok -= 1;
    const updateStokBuku = await findBukuById.save({ transaction });
    if (!updateStokBuku) {
      throw new Error("Stok buku gagal diupdate!");
    }
    // commit transaction
    await transaction.commit();
    return response(res, {
      status: "success",
      message: "Data peminjaman berhasil ditambahkan!",
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

module.exports = {
  create,
};
