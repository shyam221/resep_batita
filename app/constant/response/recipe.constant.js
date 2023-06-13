exports.listRecipeRes = (data, favorite, userId) => {
  try {
    const listResep = [];
    data.forEach((el) => {
      const liked = favorite.count({
        where: { idResep: el.id },
      });
      const resep = {
        id: el.id,
        title: el.title,
        image: el.image,
        isLiked: false,
        liked: parseInt(liked, 10) ? liked : 0,
        nutrition: el.nutrition,
      };
      favorite
        .findOne({ where: { userId: userId, idResep: el.id } })
        .then((data) => {
          resep.isLiked = data && data != null ? true : false
        });
      listResep.push(resep);
    });
    return listResep;
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.detailRecipeRes = (data) => {
  return {
    id: data.id,
    title: data.title,
    image: data.image,
    lamaPembuatan: data.readyInMinutes,
    ingredients: bahanRecipe(data),
    summary: data.summary,
  };
};

const bahanRecipe = (data) => {
  const listBahan = [];
  data.extendedIngredients.forEach((el) => {
    const bahan = {
      id: el.id,
      name: el.name,
      originalName: el.originalName,
      amount: el.measures.metric.amount,
      unitLong: el.measures.metric.unitLong,
    };
    listBahan.push(bahan);
  });
  return listBahan;
};
