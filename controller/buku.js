const { Buku, RakBuku, Sequelize, sequelize } = require("../models");
const response = require("../helper/response");
const redisConnection = require("../config/redis");
const { deleteKeys } = require("../helper/redis");

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

const create = async (req, res) => {
  // start transaction
  const transaction = await sequelize.transaction();
  try {
    const {
      judul_buku,
      nama_penulis,
      nama_penerbit,
      tahun_penerbit,
      stok,
      nama_rak_buku,
    } = req.body;
    // findOrCreate rak_buku
    const rakBuku = await RakBuku.findOrCreate({
      where: { nama: nama_rak_buku },
      defaults: { nama: nama_rak_buku },
      transaction,
    });
    // findOrCreate buku
    const createBuku = await Buku.findOrCreate({
      where: {
        judul_buku,
        nama_penulis,
        nama_penerbit,
        tahun_penerbit,
        id_rak_buku: rakBuku[0].id,
      },
      defaults: {
        judul_buku,
        nama_penulis,
        nama_penerbit,
        tahun_penerbit,
        stok,
        id_rak_buku: rakBuku[0].id,
      },
      transaction,
    });
    // cek buku duplikat
    if (!createBuku[1]) {
      return response(
        res,
        {
          status: "error",
          message: "Data buku sudah ada!",
        },
        400
      );
    }
    // delete getBuku di redis | commit transaction
    await Promise.all([deleteKeys("getBuku:*"), transaction.commit()]);
    return response(res, {
      status: "success",
      message: "Data buku berhasil ditambahkan!",
    });
  } catch (error) {
    // rollback transaction
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

const update = async (req, res) => {
  try {
    const { judul_buku, nama_penulis, nama_penerbit, tahun_penerbit, stok } =
      req.body;
    const { id } = req.params;
    const findBukuById = await Buku.findByPk(id);
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
    if (judul_buku) findBukuById.judul_buku = judul_buku;
    if (nama_penulis) findBukuById.nama_penulis = nama_penulis;
    if (nama_penerbit) findBukuById.nama_penerbit = nama_penerbit;
    if (tahun_penerbit) findBukuById.tahun_penerbit = tahun_penerbit;
    if (stok) findBukuById.stok = stok;
    const updateBuku = await findBukuById.save();
    if (!updateBuku) {
      return response(
        res,
        {
          status: "error",
          message: "Data buku gagal diupdate!",
        },
        400
      );
    }
    await deleteKeys("getBuku:*");
    return response(res, {
      status: "success",
      message: "Data buku berhasil diupdate!",
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
    const getBukuById = await Buku.findOne({
      where: {
        id,
      },
      attributes: [
        "id",
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
    });
    if (!getBukuById) {
      return response(
        res,
        {
          status: "error",
          message: "Data buku tidak ada!",
        },
        404
      );
    }
    // set getBuku redis
    await redisConnection.setEx(
      `getBuku:${id}`,
      3600,
      JSON.stringify(getBukuById)
    );
    return response(res, {
      status: "success",
      data: getBukuById,
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

const updateNamaRakBuku = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_rak_buku } = req.body;
    // cari data buku
    const getBukuById = await Buku.findByPk(id);
    if (!getBukuById) {
      return response(
        res,
        {
          status: "error",
          message: "Data buku tidak ada!",
        },
        404
      );
    }
    // cari rak buku berdasarkan nama
    const getRakBuku = await RakBuku.findOne({
      where: {
        nama: nama_rak_buku,
      },
    });

    if (!getRakBuku) {
      return response(
        res,
        {
          status: "error",
          message: "Nama rak buku tidak ada!",
        },
        404
      );
    }
    // update id_rak_buku di table buku
    getBukuById.id_rak_buku = getRakBuku.id;
    const updateBuku = await getBukuById.save();
    if (!updateBuku) {
      return response(
        res,
        {
          status: "error",
          message: "Data buku gagal diupdate!",
        },
        400
      );
    }
    await deleteKeys("getBuku:*");
    return response(res, {
      status: "success",
      message: "Nama rak buku berhasil diupdate!",
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

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    // cari data buku berdasarkan id
    const getBukuById = await Buku.findByPk(id);
    if (!getBukuById) {
      return response(
        res,
        {
          status: "error",
          message: "Data buku tidak ada!",
        },
        404
      );
    }
    // delete buku berdasarkan id
    const deleteBuku = await getBukuById.destroy();
    if (!deleteBuku) {
      return response(
        res,
        {
          status: "error",
          message: "Data buku gagal dihapus!",
        },
        400
      );
    }
    await deleteKeys("getBuku:*");
    return response(res, {
      status: "success",
      message: "Data buku berhasil dihapus!",
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
  create,
  update,
  getById,
  updateNamaRakBuku,
  destroy,
};
