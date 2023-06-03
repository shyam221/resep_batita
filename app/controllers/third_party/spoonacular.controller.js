const axios = require("axios");
const { success } = require("../../base/response.base");
const {bayiTypeOne, bayiTypeTwo} = require('../../constant/bayi_type')

exports.findAllRecipe = (req, res) => {
  try {
    const umurBayi = req.query.umur;
    var params;
    if (umurBayi) {
      if (umurBayi === "0-5") {
        params = bayiTypeOne;
      } else if (umurBayi === "6-11") {
        params = bayiTypeTwo;
      }
    }
    console.log(params)
    const { size, page } = req.query;
    const offset = size * page;

    params.offset = offset;
    params.type = "soup";
    params.sort = "popularity";
    params.sortDirection = "asc";
    params.apiKey = '413053c9db5b4415bf7a36216ac867c1';

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
