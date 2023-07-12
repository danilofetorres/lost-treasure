$(".ldb").click(function() {
  axios.get("https://jumbled-river-bush.glitch.me").then((response) => {
    const ranking = response.data;
  
    ranking.sort((a, b) => a.time - b.time);

    $(".modal-body").html("<ul></ul>");
  
    ranking.forEach((entry, index) => {
      // leaderboardTextContent += `${index + 1}. ${entry.player}: ${entry.time}`;
      $(".modal-body ul").append(`<p>${index + 1}. ${entry.player}: ${entry.time}</p>`);
    });
  
  });
});
