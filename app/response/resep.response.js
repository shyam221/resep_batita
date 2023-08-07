exports.resepRes = (resep) => {
  const response = {}
  response.id = resep.id
  response.nama = resep.nama
  response.energi = resep.detail_resep.energi
  response.karbohidrat = resep.detail_resep.karbohidrat
  response.lemak = resep.detail_resep.lemak
  response.protein = resep.detail_resep.protein
  response.porsi = resep.detail_resep.porsi
  response.umur = resep.detail_resep.umur
  response.beratBadan = resep.detail_resep.beratBadan
  response.isFavorited = resep.isFavorited
  response.favorites = resep.favorites
  response.image = resep.image

  return response
}

exports.detailResepRes = (resep, image) => {
  const response = {}
  response.id = resep.id
  response.nama = resep.nama
  response.energi = resep.detail_resep.energi
  response.karbohidrat = resep.detail_resep.karbohidrat
  response.lemak = resep.detail_resep.lemak
  response.protein = resep.detail_resep.protein
  response.porsi = resep.detail_resep.porsi
  response.umur = resep.detail_resep.umur
  response.beratBadan = resep.detail_resep.beratBadan
  response.isFavorited = resep.isFavorited
  response.favorites = resep.favorites
  response.bahanBahan = resep.detail_resep.bahan_reseps
  response.caraPembuatan = resep.detail_resep.caraPembuatan
  response.image = image

  return response
}