const axios = require("axios");
const { success } = require("../../base/response.base");
const { bayiTypeOne, bayiTypeTwo } = require('../../constant/bayi_type')
const { detailRecipeRes, listRecipeRes } = require('../../constant/response/recipe.constant')
const apiKey = '413053c9db5b4415bf7a36216ac867c1'
const db = require('../../model')
const Favorite = db.favorites

exports.findAllRecipe = (req, res) => {
  try {
    const { umurBayi, beratBadan, size, page, sort, userId } = req.query;
    var params;
    if (umurBayi || beratBadan) {
      if ((umurBayi >= 0 || umurBayi <= 5) || beratBadan <= 6) {
        params = bayiTypeOne;
      } else if ((umurBayi >= 6 || umurBayi <= 11) || (beratBadan > 6 || beratBadan <= 9)) {
        params = bayiTypeTwo;
      }
    } else {
      params = bayiTypeTwo
      params.maxCalories = req.query.jumlahKkl ? req.query.jumlahKkl : ''
    }
  
    const offset = size * (page - 1);

    params.offset = offset;
    params.type = "soup";
    params.sort = sort ? "popularity" : '';
    params.sortDirection = "asc";
    params.apiKey = apiKey;

    axios
      .get("https://api.spoonacular.com/recipes/complexSearch", {
        params: params,
      })
      .then((data) => {
        console.log(data.data)
        const a = data.data.results
        const hasNext = data.data.totalResults - data.data.offset
        const nextPage = hasNext > size ? parseInt(page) + 1 : 0
        const prevPage = page == 0 ? 0 : parseInt(page) - 1 
        const mappedRecipe = listRecipeRes(a, Favorite, userId)
        const resData = {
          nextPage: nextPage,
          prevPage: prevPage != 0 ? prevPage : null,
          totalItems: hasNext,
          content: mappedRecipe
        }
        res.status(200).json(success("success", resData, 200));
      })
      .catch((err) => {
        res
          .status(500)
          .json(
            success(err.message || "Terjadi error saat fetch data", "", 500)
          );
      });
  } catch (e) {
    console.error(e.stack)
    res
      .status(500)
      .json(success(e.message || "Terjadi error saat fetch data", "", 500));
  }
};

exports.detailResep = (req, res) => {
  try {
    const idResep = req.params.idResep
    const params = {
      apiKey: apiKey,
      includeNutrition: true
    }
    axios.get(`https://api.spoonacular.com/recipes/${idResep}/information`, { params: params })
      .then((data) => {
        const responseData = detailRecipeRes(data.data)
        res.status(200).json(success('success', responseData, 200))
      }).catch((err) => {
        console.log(err)
          res
            .status(500)
            .json(
              success(err.message || "Terjadi error saat fetch data", "", 500)
            );
        })
  } catch (e) {
    console.error(e.stack)
    res
      .status(500)
      .json(success(e.message || "Terjadi error saat fetch data", "", 500));
  }
}