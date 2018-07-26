var app = getApp();
var utils = require('../../utils/utils.js');
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        containerShow: true,
        searchPanelShow: false,
        searchRequest: {},
        searchContent: '',
        searchUrl: '',
        isEmpty: true
    },
    onLoad: function () {
        var moviesBaseUrl = app.globalData.moviesBaseUrl;
        var top250Url = moviesBaseUrl + '/v2/movie/top250' + '?start=0&count=3';
        var inTheatersUrl = moviesBaseUrl + '/v2/movie/in_theaters' + '?start=0&count=3';
        var comingSoonUrl = moviesBaseUrl + '/v2/movie/coming_soon' + '?start=0&count=3';
        this.getMoviesData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMoviesData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMoviesData(top250Url, "top250", "豆瓣Top250");
    },
    onBindChange: function (e) {
        var text = e.detail.value;
        var searchUrlBase = app.globalData.moviesBaseUrl + '/v2/movie/search?q=' + text;
        this.setData({
            searchUrl: searchUrlBase,
            isEmpty: true,
            searchRequest: {},
            totalCount: 0
        })
        this.getMoviesData(searchUrlBase, "searchRequest", "");
    },
    onBindFocus: function (e) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },
    onCancelImgTap: function (e) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchRequest: {},
            searchContent: '',
            searchUrl: '',
            totalCount: 0,
            isEmpty:true
        })
    },
    onReachBottom: function (e) {
        if (this.data.searchPanelShow) {
            var nextUrl = this.data.searchUrl + '&start=' + this.data.totalCount + '&count=20';
            wx.showNavigationBarLoading();
            this.getMoviesData(nextUrl,"searchRequest","");
        }

    },
    getMoviesData: function (url, keyName, categoryTitle) {
        var that = this;
        utils.http(url, function (res) {
            that.processMoviesData(res.data.subjects, keyName, categoryTitle);
        })
    },
    processMoviesData: function (data, keyName, categoryTitle) {
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
        }
        if (keyName === "searchRequest") {
            if (!this.data.isEmpty) {
                // 将原有的数据与新数据合并
                movies = this.data.searchRequest.movies.concat(movies);
                this.setData({
                    totalCount: this.data.totalCount + 20
                })
            } else {
                this.setData({
                    isEmpty: false,
                    totalCount: this.data.totalCount + 20
                })
            }
        }
        var readyData = {};
        readyData[keyName] = {
            categoryTitle: categoryTitle,
            movies: movies
        };
        this.setData(readyData);

    },
    onMoreTap: function (e) {
        wx.navigateTo({
            url: 'more-movies/more-movies?category=' + e.currentTarget.dataset.category
        })
    },
    onMovieTap:function(e){
        wx.navigateTo({
            url:'/pages/movies/movie-detail/movie-detail?id=' + e.currentTarget.dataset.movieId
        })
    }
})