const axios = require("axios");
const { success } = require("../../base/response.base");
const { bayiTypeOne, bayiTypeTwo } = require('../../constant/bayi_type')
const { detailRecipeRes } = require('../../constant/response/recipe.constant')
const apiKey = '413053c9db5b4415bf7a36216ac867c1'

exports.findAllRecipe = (req, res) => {
  try {
    const umurBayi = req.query.umur;
    var params;
    if (umurBayi) {
      if (umurBayi >= 0 || umurBayi <= 5) {
        params = bayiTypeOne;
      } else if (umurBayi >= 6 || umurBayi <= 11) {
        params = bayiTypeTwo;
      }
    } else {
      params = bayiTypeTwo
      params.maxCalories = req.query.jumlahKkl ? req.query.jumlahKkl : ''
    }
    
    const { size, page } = req.query;
    const offset = size * page;

    params.offset = offset;
    params.type = "soup";
    params.sort = "popularity";
    params.sortDirection = "asc";
    params.apiKey = apiKey;

    axios
      .get("https://api.spoonacular.com/recipes/complexSearch", {
        params: params,
      })
      .then((data) => {
        const a = data.data.results
        res.status(200).json(success("success", a, 200));
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