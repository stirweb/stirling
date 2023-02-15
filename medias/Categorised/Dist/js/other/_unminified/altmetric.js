var stir = stir || {};
stir.altmetric = {
  key: '64d04a1774ca2eb54316de3a8365cda2',
  max: 5,
  callback: function callback(json) {
    var index;
    var handle;
    var doi;
    var html = ['<table>', '<caption>University of Stirling research papers ranked by Altmetric</caption>', '<thead><tr>', '<th scope=col>Position</th><th scope=col>Research paper</th><th class=donut scope=col>Altmetric score</th>', '</thead></tr>', '<tbody>'];
    var container = document.getElementById('top10');
    for (index = 0; index < json.results.length; ++index) {
      handle = 'http://hdl.handle.net/' + json.results[index]['handle'];
      doi = json.results[index]['doi'];
      html.push('<tr><td>');
      html.push((index + 1).toString());
      html.push('</td><td>');
      html.push('<a href="' + handle + '">' + json.results[index]['title'] + '</a>');
      html.push('</td>' + '<td class=donut>');
      html.push('<div class=altmetric-embed data-badge-type=donut data-badge-popover=left data-doi="' + doi + '" data-hide-no-mentions=true></div>');
      html.push('</td></tr>');
    }
    html.push('</tbody>');
    html.push('</table>');
    container && (container.innerHTML = html.join(''));

    // call Altmetric's embed function:
    if ('function' == typeof _altmetric_embed_init) {
      _altmetric_embed_init(container);
    }
  }
};

/* Get the feed */
(function () {
  var query,
    el = document.createElement('script');
  query = 'key=' + stir.altmetric.key + '&num_results=' + stir.altmetric.max;
  query += '&group=stirling&order_by=score&callback=stir.altmetric.callback';
  query += '&citation_type=news%2Carticle%2Cclinical_trial_study_record%2Cdataset%2Cbook%2Cchapter%2Cgeneric';
  el.src = 'https://api.altmetric.com/v1/citations/at?' + query;
  document.body.insertAdjacentElement('beforeend', el);
})();