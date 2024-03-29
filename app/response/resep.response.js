exports.resepRes = (resep) => {
  const response = {}
  response.id = resep.id
  response.nama = resep.nama
  response.energi = resep.detail_resep.energi
  response.karbohidrat = resep.detail_resep.karbohidrat
  response.lemak = resep.detail_resep.lemak
  response.protein = resep.detail_resep.protein
  response.porsi = resep.detail_resep.porsi
  response.umur = resep.detail_resep.untukUmur + ' - ' + resep.detail_resep.sampaiUmur
  response.beratBadan = resep.detail_resep.beratBadan
  response.isFavorited = resep.isFavorited
  response.favorites = resep.favorites
  response.image = resep.image

  return response
}

exports.resepResDetail = (resep) => {
  const response = {}
  response.id = resep.id
  response.nama = resep.nama
  response.energi = resep.detail_resep.energi
  response.karbohidrat = resep.detail_resep.karbohidrat
  response.lemak = resep.detail_resep.lemak
  response.protein = resep.detail_resep.protein
  response.porsi = resep.detail_resep.porsi
  response.umur = resep.detail_resep.untukUmur + ' - ' + resep.detail_resep.sampaiUmur
  response.untukUmur = resep.detail_resep.untukUmur
  response.sampaiUmur = resep.detail_resep.sampaiUmur
  response.beratBadan = resep.detail_resep.beratBadan
  response.isFavorited = resep.isFavorited
  response.favorites = resep.favorites
  response.image = resep.image
  response.caraPembuatan = resep.detail_resep.caraPembuatan

  return response
}

exports.detailResepRes = (resep, image) => {
  console.log(resep)
  const response = {}
  response.id = resep.id
  response.nama = resep.nama
  response.energi = resep.detail_resep.energi
  response.karbohidrat = resep.detail_resep.karbohidrat
  response.lemak = resep.detail_resep.lemak
  response.protein = resep.detail_resep.protein
  response.porsi = resep.detail_resep.porsi
  response.umur = resep.detail_resep.untukUmur + ' - ' + resep.detail_resep.sampaiUmur
  response.untukUmur = resep.detail_resep.untukUmur
  response.sampaiUmur = resep.detail_resep.sampaiUmur
  response.beratBadan = resep.detail_resep.beratBadan
  response.sumber = resep.detail_resep.sumber
  response.isFavorited = resep.isFavorited
  response.favorites = resep.favorites
  response.caraPembuatan = resep.detail_resep.caraPembuatan
  response.detailResepId = resep.detail_resep.id

  const ingredients = []

  for (bahan of resep.bahan_reseps ) {
    ingredients.push(bahan.bahan_bahan)
  }
  
  response.bahanBahan = ingredients
  response.image = image


  return response
}