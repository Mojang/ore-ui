chrome.devtools.network.onNavigated.addListener(() => {
  chrome.devtools.panels.create(
    "Font Picker",
    "FontPicker.png",
    "panel.html",
    function(panel) {
      console.log('Success!')
  });
});
