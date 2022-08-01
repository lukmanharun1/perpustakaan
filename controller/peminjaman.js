const {
  Buku,
  Mahasiswa,
  Peminjaman,
  RakBuku,
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
      throw {
        message: "Data buku tidak ada!",
        statusCode: 404,
      };
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
      throw {
        message: "Data mahasiswa tidak ada!",
        statusCode: 404,
      };
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
      throw {
        message: "Tidak boleh meminjam buku yang sama!",
        statusCode: 400,
      };
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
      error.statusCode || 500
    );
  }
};

const getAll = async (req, res) => {
  try {
    const getPeminjaman = await Peminjaman.findAll({
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
          include: {
            model: RakBuku,
            as: "rak_buku",
            attributes: ["nama"],
          },
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
        "id_buku",
        "id_mahasiswa",
      ],
    });
    return response(res, {
      status: "success",
      data: getPeminjaman,
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
