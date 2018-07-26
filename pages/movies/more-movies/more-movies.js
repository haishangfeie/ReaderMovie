var app = getApp();
var utils = require('../../../utils/utils.js');
Page({
  data: {
    movies: [],
    navigationBarTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigationBarTitle: category
    });
    var moviesUrl = '';
    var moviesBaseUrl = app.globalData.moviesBaseUrl;
    switch (category) {
      case "正在热映":
        moviesUrl = moviesBaseUrl + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        moviesUrl = moviesBaseUrl + '/v2/movie/coming_soon';
        break;
      case "豆瓣Top250":
        moviesUrl = moviesBaseUrl + '/v2/movie/top250';
        break;
    };
    if (moviesUrl) {
      this.setData({
        requestUrl: moviesUrl
      })
      wx.showNavigationBarLoading();
      var that = this;
      utils.http(moviesUrl, function (res) {
        that.processMoviesData(res.data.subjects);
      })
    }
  },
  onReady: function (e) {
    wx.setNavigationBarTitle({
      "title": this.data.navigationBarTitle
    })
  },
  processMoviesData: function (data) {
    var movies = [];
    for (var idx in data) {
      var subject = data[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: utils.converStarsToArray(subject.rating.stars)
      }
      movies.push(temp);
    };
    // 如果加载了新的数据，那么要和旧的数据合并在一起
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.setData({
      totalCount: this.data.totalCount + 20
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function (e) {
    var that = this;
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    wx.showNavigationBarLoading();
    utils.http(nextUrl, function (res) {
      that.processMoviesData(res.data.subjects);
    })
  },
  // 在json文件中开启下拉刷新后，再配置下拉刷新事件
  onPullDownRefresh: function (e) {
    var that = this;
    var refreshUrl = this.data.requestUrl;
    wx.showNavigationBarLoading();
    this.setData({
      isEmpty: true,
      movies: {},
      totalCount: 0
    })
    utils.http(refreshUrl, function (res) {
      that.processMoviesData(res.data.subjects);
    })
  },
  onMovieTap: function (e) {
    wx.navigateTo({
      url: '/pages/movies/movie-detail/movie-detail?id=' + e.currentTarget.dataset.movieId
    })
  }
})