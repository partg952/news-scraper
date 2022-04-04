const express = require("express");
const app = express();
const requests = require("requests");
const cheerio = require("cheerio");
const PORT = process.env.PORT || 8080;


app.get("/", (req, res) => {
  requests("https://www.ndtv.com/").on("data", (page) => {
    const data = [];
    const $ = cheerio.load(page);
    $("ul.list-news").each(function(i){
      console.log($(this).text())
    })
    data.push({
      topStories: getTopStories($),
      trendingNews: getTrendingNews($),
      cricketNews: getCricketNews($),
    });
    res.send(data);
  });
});


app.get("/search",(req,res)=>{
  const keyword = req.query['keyword'];

  requests(`https://www.ndtv.com/search?searchtext=${keyword}`).on('data',data=>{
    const $ = cheerio.load(data);
    const arr = [];
    arr.push(searchFromPage($));
    res.send(arr);
  })

})


app.listen(PORT, () => console.log("api is listening at port 8080..."));

function searchFromPage($){
  // function to get data from the searched page
  const data = [];
  $("ul.src_lst-ul > li").each(function(i){
    data.push({
      image_thumbnail:$("ul.src_lst-ul > li > div.src_lst-lhs > span.img-gratio > img").eq(i).attr("src"),
      title:$("ul.src_lst-ul > li > div.src_lst-lhs > span.img-gratio > img").eq(i).attr("alt")
    })
  })
  return data;
}



function getTopStories($) {
  //function for scraping the top stories from the homepage
  const data = [];
  $("div.featured_cont > ul > li").each(function (i) {
    data.push({
      image_thumbnail: $(
        "div.featured_cont > ul > li > div.thumbnail > a > img"
      )
        .eq(i)
        .attr("src"),
      title: $("div.featured_cont > ul > li > div.thumbnail > a > img")
        .eq(i)
        .attr("title"),
    });
  });
  return data;
}

function getTrendingNews($) {
  // function for getting the trending news from the homepage
  const data = [];
  $("div.latest_widget > ul > li").each(function (i) {
    data.push({
      image_thumbnail: $(
        "div.latest_widget > ul > li > div.cont_cmn > div.thumbnail > a > img"
      )
        .eq(i)
        .attr("src"),
      title: $("div.latest_widget > ul > li > div.cont_cmn > h5 > a")
        .eq(i)
        .text(),
    });
  });
  return data;
}

function getCricketNews($){
    //function for getting cricket news from the homepage
    const data = [];
    $("div.cricket-news-1 > ul.cricket-details > li").each(function(i){

        data.push({
          image_thumbnail: $(
            "div.cricket-news-1 >  ul.cricket-details > li > div.thumbnail > a > img"
          )
            .eq(i)
            .attr("src"),
          title: $(
            "div.cricket-news-1 > ul.cricket-details > li > div.thumbnail > a > img"
          )
            .eq(i)
            .attr("title"),
        });
    })
    return data;
}
