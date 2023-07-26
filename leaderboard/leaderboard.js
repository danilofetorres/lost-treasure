$(".ldb").click(function() {
  axios.get("https://jumbled-river-bush.glitch.me").then((response) => {
    const ranking = response.data;
  
    ranking.sort((a, b) => a.time - b.time);

    $(".ranking").html("<ul></ul>");
  
    ranking.forEach((entry, index) => {
      $(".ranking ul").append(`<p>${index + 1}. ${entry.player}: ${entry.time}</p>`);
    });
  
  });
});
