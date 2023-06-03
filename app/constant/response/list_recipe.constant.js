exports.listRecipeRes = (data) => {
  return {
    id: data.id,
    title: data.title,
    image: data.image,
    nutrition: data.nutrition
  }
}