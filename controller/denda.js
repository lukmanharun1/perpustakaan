const { Denda, sequelize, Sequelize, Buku } = require("../models");
const response = require("../helper/response");

const create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id_buku, id_mahasiswa, status } = req.body;
    // create data denda
    const createDenda = await Denda.create({
      id_buku,
      id_mahasiswa,
      status,
      transaction,
    });
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

module.exports = {
  create,
};
