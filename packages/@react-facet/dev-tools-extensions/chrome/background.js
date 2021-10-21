// background.js

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });

  console.log(chrome.runtime.id)
  console.log('Default background color set to %cgreen', `color: ${color}`);
});


chrome.runtime.onMessage.addListener((request, sender) => {
  console.log('message received on background', {request, sender})
});
