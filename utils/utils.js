// var utils = {};
// utils.converStarsToArray = function(starsRating){
//     var stars = [];
//     var tmpRating = starsRating*1;
//     for(;tmpRating>0;){
//         if(tmpRating>=10){
//             tmpRating -=10;
//             stars.push(10);
//         } else if(tmpRating ===5){
//             stars.push(5);
//             break;
//         } else {
//             break;
//         }
//     }
//     while(stars.length<5){
//         stars.push(0);
//     }
//     return stars;
// }
var utils = {};
utils.converStarsToArray = function (starsRating) {
    var stars = [];
    var tmpRating = starsRating * 1;
    for (var i = 0; i < 5; i++) {
        if (tmpRating >= 10) {
            tmpRating -= 10;
            stars.push(10);
        } else if (tmpRating >= 5) {
            tmpRating -= 5;
            stars.push(5);
        } else {
            stars.push(0);
        }
    }
    return stars;
}
utils.http = function (url, callback) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            'content-type': 'json'
        },
        success: function (res) {
            callback(res)
        },
        fail: function (err) {
            console.log(err);
        }
    })
};
// utils.convertToCastString = function (castsArr) {
//     var tmpArr = [];
//     castsArr.forEach(function (val, idx, arr) {
//         tmpArr.push(val.name);
//     });
//     return tmpArr.join(' / ');
// }
utils.convertToCastString = function (castsArr) {
    var castsStr ='';
    castsArr.forEach(function (val, idx, arr) {
        castsStr += val.name + ' / ';
    });
    return castsStr.substring(0,castsStr.length-3);
}
utils.convertToCastInfos = function (castsArr) {
    var castsInfo = [];
    castsArr.forEach(function (val, idx, arr) {
        var castObj = {
            avatars: val.avatars ? val.avatars.large : '',
            name: val.name
        };
        castsInfo.push(castObj);
    });
    return castsInfo;
}
module.exports = utils;

