chrome.devtools.network.onNavigated.addListener(() => {
  console.log(chrome.runtime.id)
  chrome.devtools.panels.create(
    "Font Picker",
    "FontPicker.png",
    "panel.html",
    function(panel) {
      console.log('Success!')
      chrome.runtime.onMessage.addListener((request, sender) => {
        console.log('message received on main', {request, sender})
      });

  });
});
