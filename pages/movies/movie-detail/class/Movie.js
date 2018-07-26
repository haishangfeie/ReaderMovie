var utils = require('../../../../utils/utils.js');
class Movie {
  constructor(url){
    this.url = url;
  }
  getMovieData(callback){
    this.callback = callback;
    var that =this;
    utils.http(this.url, function (res) {
      that.processMoviesData(res);
    })
  }
  processMoviesData(data) {
    if (!data) {
      return;
    };
    if (!data.data) {
      return;
    }
    var director = {
      avatar: '',
      name: '',
      id: ''
    };
    if (data.data.directors[0] != null) {
      if (data.data.directors[0].avatars) {
        director.avatar = data.data.directors[0].avatars.large;
      }
      director.name = data.data.directors[0].name;
      director.id = data.data.directors[0].id;
    }
    var movie = {
      movieImg: (data.data.images ? data.data.images.large : ''),
      country: data.data.countries[0],
      title: data.data.title,
      originalTitle: data.data.original_title,
      wishCount: data.data.wish_count,
      commentCount: data.data.comments_count,
      year: data.data.year,
      generes: data.data.genres.join("、"),
      stars: utils.converStarsToArray(data.data.rating.stars),
      average: data.data.rating.average,
      director: director,
      casts: utils.convertToCastString(data.data.casts),
      castsInfo: utils.convertToCastInfos(data.data.casts),
      summary: data.data.summary
    };
    this.callback(movie);
  }
}
export {Movie};