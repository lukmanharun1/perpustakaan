const { RakBuku } = require("../models");
module.exports = async () => {
  const id_rak_bukus = await Promise.all([
    RakBuku.findOne({
      where: {
        nama: "001 finansial",
      },
    }),
    RakBuku.findOne({
      where: {
        nama: "002 finansial",
      },
    }),
    RakBuku.findOne({
      where: {
        nama: "001 umum",
      },
    }),
    RakBuku.findOne({
      where: {
        nama: "001 umum",
      },
    }),
  ]);
  return [
    {
      judul_buku: "Compound Interest",
      nama_penulis: "Lukman Harun",
      nama_penerbit: "Erlangga",
      tahun_penerbit: "2022",
      stok: 50,
      id_rak_buku: id_rak_bukus[0].id,
    },
    {
      judul_buku: "Multibagger",
      nama_penulis: "Rivan Kurniawan",
      nama_penerbit: "Gramedia",
      tahun_penerbit: "2022",
      stok: 10,
      id_rak_buku: id_rak_bukus[1].id,
    },
    {
      judul_buku: "Teknik All In",
      nama_penulis: "Robert Widjaja",
      nama_penerbit: "Gramedia",
      tahun_penerbit: "2021",
      stok: 10,
      id_rak_buku: id_rak_bukus[2].id,
    },
    {
      judul_buku: "Belajar Astronomi",
      nama_penulis: "Ridwan",
      nama_penerbit: "Kompas",
      tahun_penerbit: "2020",
      stok: 20,
      id_rak_buku: id_rak_bukus[3].id,
    },
  ];
};
