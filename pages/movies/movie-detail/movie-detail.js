// pages/movies/movie-detail/movie-detail.js
import {Movie} from "class/Movie.js";
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    var movieId = options.id;
    var movieDetailUrl = app.globalData.moviesBaseUrl + '/v2/movie/subject/' + movieId;
    var movie = new Movie(movieDetailUrl);
    var that = this;
    movie.getMovieData(function(movie){
      that.setData(movie);
    })
  },
  viewMoviePostImg:function(e){
    var imgUrl = e.currentTarget.dataset.src;
    var castsImgUrl = e.currentTarget.dataset.casts;
    var imgs = [imgUrl];
    // 如果点击了封面，会传入影人的信息，将影人的图片也加入预览，如果点击背景则只预览该图片
    if(castsImgUrl){
      castsImgUrl.forEach(function(val,inx,arr){
        imgs.push(val.avatars);
      })
    }
    wx.previewImage({
      current : imgUrl,
      urls : imgs
    })
  },
})