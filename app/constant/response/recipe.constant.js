exports.listRecipeRes = (data) => {
  return {
    id: data.id,
    title: data.title,
    image: data.image,
    nutrition: data.nutrition
  }
}

exports.detailRecipeRes = (data) => {
  return {
    id: data.id,
    title: data.title,
    image: data.image,
    lamaPembuatan: data.readyInMinutes,
    ingredients: bahanRecipe(data),
    summary: data.summary
  }
}

const bahanRecipe = (data) => {
  const listBahan = []
  data.extendedIngredients.forEach(el => {
    const bahan = {
      id: el.id,
      name: el.name,
      originalName: el.originalName,
      amount: el.measures.metric.amount,
      unitLong: el.measures.metric.unitLong
    }
    listBahan.push(bahan)
  });
  return listBahan
}