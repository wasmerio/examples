(function(){var t=Reveal.getConfig().multiplex,o=t.id,i=io.connect(t.url);i.on(t.id,function(e){e.socketId===o&&window.location.host!=="localhost:1947"&&Reveal.setState(e.state)})})();
