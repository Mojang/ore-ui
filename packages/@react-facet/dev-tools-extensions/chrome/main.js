  chrome.devtools.panels.create(
    "Font Picker",
    "FontPicker.png",
    "panel.html",
    function() {
      chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name === "react-facet-devtools");
        port.onMessage.addListener(function(msg) {
          console.log('INSIDE PANEL', msg)
        });
      });
    });

    chrome.runtime.onConnect.addListener(function(port) {
      console.assert(port.name === "react-facet-devtools");
      port.onMessage.addListener(function(msg) {
        console.log('PANEL RECEIVING MESSAGE', msg)
      });
    });
